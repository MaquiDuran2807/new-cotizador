import json
import os
import tempfile
import shutil
import base64

from django.contrib.admin import AdminSite
from django.contrib import admin
from django.shortcuts import render
from django.http import JsonResponse
from django.urls import path
from django.contrib import messages
from django.views.decorators.clickjacking import xframe_options_exempt

from products.bulk_processor import process_json_and_images, build_summary


class CodenSolarAdminSite(AdminSite):
    site_header = "CodenSolar"
    site_title = "CodenSolar"
    index_title = "Panel de Administración"
    site_url = "/"

    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request)

        app_dict = {}
        for app in app_list:
            for model in app["models"]:
                app_dict[model["object_name"]] = model

        grupos = [
            (
                "Productos",
                ["Category", "ShowCategory", "Products"],
            ),
            (
                "Configuración",
                ["CarouselSlide"],
            ),
            (
                "Componentes Solares",
                ["SolarPanel", "Battery", "Reguladores", "Inversores", "Voltage"],
            ),
            (
                "Kits",
                ["KitHogar", "Otros"],
            ),
            (
                "Cableado y Protección",
                ["Breakers", "RubberizedCables", "VehicleCables", "GroundSecurityKits"],
            ),
            (
                "Soportes y Conexiones",
                ["PanelSupports", "BatterySupports", "Connectors", "Terminals"],
            ),
            (
                "Eléctrico",
                ["CentralizedModule", "UnityPower", "ElectricMaterials"],
            ),
        ]

        custom_app_list = []
        for group_name, model_names in grupos:
            models_in_group = []
            for name in model_names:
                if name in app_dict:
                    models_in_group.append(app_dict[name])
            if models_in_group:
                custom_app_list.append(
                    {
                        "name": group_name,
                        "app_label": group_name.lower()
                        .replace(" ", "_")
                        .replace("ó", "o"),
                        "app_url": "#",
                        "has_module_perms": True,
                        "models": models_in_group,
                    }
                )

        for app in app_list:
            if app["app_label"] in ("users", "socialaccount", "account"):
                custom_app_list.append(app)

        return custom_app_list

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path(
                "bulk-import/",
                self.admin_view(self.bulk_import_view),
                name="bulk-import",
            ),
            path(
                "bulk-import/upload-file/",
                self.admin_view(self.upload_file_view),
                name="bulk-import-upload",
            ),
        ]
        return my_urls + urls

    def get_or_create_temp_dir(self, request):
        temp_dir = request.session.get("bulk_temp_dir")
        if temp_dir and os.path.isdir(temp_dir):
            return temp_dir
        temp_dir = tempfile.mkdtemp(prefix="bulk_import_")
        request.session["bulk_temp_dir"] = temp_dir
        return temp_dir

    @xframe_options_exempt
    def upload_file_view(self, request):
        if request.method != "POST":
            return JsonResponse({"error": "POST required"}, status=405)

        file_data = request.POST.get("file_data")
        filename = request.POST.get("filename")

        if not file_data or not filename:
            return JsonResponse({"error": "Missing file_data or filename"}, status=400)

        temp_dir = self.get_or_create_temp_dir(request)

        name, ext = os.path.splitext(filename)
        dest = os.path.join(temp_dir, filename)
        counter = 1
        while os.path.exists(dest):
            dest = os.path.join(temp_dir, f"{name}_{counter}{ext}")
            counter += 1

        with open(dest, "wb") as f:
            f.write(base64.b64decode(file_data))

        return JsonResponse({"filename": os.path.basename(dest)})

    def bulk_import_view(self, request):
        from products.models import Products, Category, Voltage

        ctx = {
            **self.each_context(request),
            "title": "Carga Masiva de Productos",
            "has_permission": request.user.is_active and request.user.is_staff,
        }

        if request.method == "POST":
            action = request.POST.get("action")

            if action == "process":
                json_raw = request.POST.get("json_files")
                images_raw = request.POST.get("image_files")
                temp_dir = request.session.get("bulk_temp_dir")

                if not json_raw or not images_raw or not temp_dir:
                    messages.error(request, "No se recibieron archivos. Arrastrá el JSON y las imágenes a las zonas correspondientes.")
                    return render(request, "admin/bulk_import.html", ctx)

                json_filenames = json.loads(json_raw)
                image_filenames = json.loads(images_raw)

                json_path = None
                for fname in json_filenames:
                    p = os.path.join(temp_dir, fname)
                    if os.path.exists(p):
                        json_path = p
                        break
                if not json_path:
                    messages.error(request, "No se encontró el archivo JSON subido.")
                    return render(request, "admin/bulk_import.html", ctx)

                json_file = open(json_path, "rb")

                image_files = []
                for fname in image_filenames:
                    p = os.path.join(temp_dir, fname)
                    if os.path.exists(p):
                        image_files.append({"name": fname, "path": p})

                products = process_json_and_images(json_file, image_files)
                json_file.close()

                request.session["bulk_products"] = products

                summary = build_summary(products)
                preview = []
                for p in products:
                    preview.append({
                        "external_id": p.get("external_id"),
                        "name": p.get("name"),
                        "price": p.get("price"),
                        "voltage_list": p.get("voltage_list"),
                        "consume": p.get("consume"),
                        "has_image": p.get("primary_image") is not None,
                    })

                ctx["show_preview"] = True
                ctx["preview_products"] = preview
                ctx["summary"] = summary
                return render(request, "admin/bulk_import.html", ctx)

            elif action == "import":
                temp_dir = request.session.pop("bulk_temp_dir", None)
                products_raw = request.session.pop("bulk_products", None)

                if not products_raw:
                    messages.error(request, "No hay datos en la sesión. Vuelve a procesar los archivos.")
                    return render(request, "admin/bulk_import.html", ctx)

                created = 0
                errors = []

                for item in products_raw:
                    try:
                        category = Category.objects.first()
                        if not category:
                            category = Category.objects.create(name="General")

                        obj = Products(
                            name=(item.get("name") or "Producto")[:50],
                            category=category,
                            price=item.get("price") or 0,
                            consume=item.get("consume") or 0,
                            description=item.get("description", ""),
                        )

                        voltage_values = item.get("voltage_list", [])
                        if voltage_values:
                            voltage_obj, _ = Voltage.objects.get_or_create(voltage=voltage_values[0])
                            obj.voltage = voltage_obj
                        else:
                            default_voltage, _ = Voltage.objects.get_or_create(voltage=12)
                            obj.voltage = default_voltage

                        image_info = item.get("primary_image")
                        if image_info and temp_dir:
                            img_name = image_info.get("name", "")
                            img_path = os.path.join(temp_dir, img_name) if img_name else None
                            if img_path and os.path.exists(img_path):
                                from django.core.files import File
                                try:
                                    with open(img_path, "rb") as f:
                                        obj.image.save(img_name, File(f), save=False)
                                except Exception as e:
                                    errors.append(f"{item.get('name', '?')}: imagen inválida ({img_name}): {str(e)}")

                        obj.save()

                        if len(voltage_values) > 1:
                            for v in voltage_values[1:]:
                                vo, _ = Voltage.objects.get_or_create(voltage=v)
                                obj.voltage.add(vo)

                        created += 1
                    except Exception as e:
                        errors.append(f"{item.get('name', '?')}: {str(e)}")

                if temp_dir and os.path.isdir(temp_dir):
                    shutil.rmtree(temp_dir, ignore_errors=True)

                ctx["show_result"] = True
                ctx["import_created"] = created
                ctx["import_errors"] = errors
                return render(request, "admin/bulk_import.html", ctx)

        return render(request, "admin/bulk_import.html", ctx)


admin_site = CodenSolarAdminSite(name="admin")
