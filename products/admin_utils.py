import openpyxl
from openpyxl.styles import Font
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib import messages
from django.db import transaction
from django.urls import path


class ExportExcelMixin:
    actions = ["download_excel_action"]
    change_list_template = "admin/change_list_with_import.html"

    def get_urls(self):
        urls = super().get_urls()
        info = self.model._meta.app_label, self.model._meta.model_name
        my_urls = [
            path(
                "import-excel/",
                self.admin_site.admin_view(self.import_excel_view),
                name="%s_%s_import" % info,
            ),
        ]
        return my_urls + urls

    def get_export_filename(self, request):
        return f"{self.model._meta.verbose_name_plural}.xlsx"

    def _get_field_label(self, field_name):
        if field_name == "__str__":
            return str(self.model._meta.verbose_name)
        if hasattr(self, field_name):
            method = getattr(self, field_name)
            if hasattr(method, "short_description"):
                return method.short_description
        try:
            field = self.model._meta.get_field(field_name)
            return field.verbose_name
        except:
            pass
        return field_name

    def _get_field_value(self, obj, field_name):
        if field_name == "__str__":
            return str(obj)
        if hasattr(self, field_name):
            method = getattr(self, field_name)
            if callable(method):
                return str(method(obj))
        if "__" in field_name:
            parts = field_name.split("__")
            value = obj
            for part in parts:
                try:
                    value = getattr(value, part)
                except AttributeError:
                    return ""
            return str(value) if value is not None else ""
        try:
            value = getattr(obj, field_name)
            if callable(value):
                value = value()
            return str(value) if value is not None else ""
        except:
            return ""

    def download_excel_action(self, request, queryset):
        wb = openpyxl.Workbook()
        ws = wb.active
        model_name = str(self.model._meta.verbose_name_plural)
        ws.title = model_name[:31]

        fields = self.list_display
        header_font = Font(bold=True, size=11)

        for col, field_name in enumerate(fields, 1):
            cell = ws.cell(row=1, column=col, value=self._get_field_label(field_name))
            cell.font = header_font

        for row_num, obj in enumerate(queryset, 2):
            for col_num, field_name in enumerate(fields, 1):
                ws.cell(row=row_num, column=col_num, value=self._get_field_value(obj, field_name))

        for col_cells in ws.columns:
            max_len = 0
            col_letter = col_cells[0].column_letter
            for cell in col_cells:
                try:
                    max_len = max(max_len, len(str(cell.value or "")))
                except:
                    pass
            ws.column_dimensions[col_letter].width = min(max_len + 3, 60)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = f'attachment; filename="{self.get_export_filename(request)}"'
        wb.save(response)
        return response

    download_excel_action.short_description = "Descargar seleccionados como Excel"

    def import_excel_view(self, request):
        context = {
            **self.admin_site.each_context(request),
            "title": f"Importar {self.model._meta.verbose_name_plural}",
            "opts": self.model._meta,
            "media": self.media,
            "has_add_permission": self.has_add_permission(request),
            "has_change_permission": self.has_change_permission(request),
            "has_delete_permission": self.has_delete_permission(request),
            "has_view_permission": self.has_view_permission(request),
        }

        if request.method == "POST":
            excel_file = request.FILES.get("excel_file")
            if not excel_file:
                messages.error(request, "Debe seleccionar un archivo Excel.")
                return render(request, "admin/import_excel.html", context)

            if not excel_file.name.endswith((".xlsx", ".xls")):
                messages.error(request, "Solo se permiten archivos .xlsx o .xls.")
                return render(request, "admin/import_excel.html", context)

            try:
                wb = openpyxl.load_workbook(excel_file)
                ws = wb.active
                rows = list(ws.iter_rows(values_only=True))

                if len(rows) < 2:
                    messages.error(request, "El archivo debe tener encabezados y al menos una fila de datos.")
                    return render(request, "admin/import_excel.html", context)

                headers = [str(h).strip() if h is not None else "" for h in rows[0]]
                data_rows = rows[1:]

                created, updated, errors = self._process_import_rows(headers, data_rows)

                if created:
                    messages.success(request, f"{created} registros creados con éxito.")
                if updated:
                    messages.success(request, f"{updated} registros actualizados con éxito.")
                if errors:
                    messages.warning(request, f"Se completó con {len(errors)} errores.")
                    context["import_errors"] = errors

                if not created and not updated and not errors:
                    messages.info(request, "No se procesaron filas.")

            except Exception as e:
                messages.error(request, f"Error al procesar el archivo: {str(e)}")

        return render(request, "admin/import_excel.html", context)

    def _process_import_rows(self, headers, data_rows):
        created = 0
        updated = 0
        errors = []

        model_fields = {f.name: f for f in self.model._meta.fields}

        col_map = {}
        for col_idx, header in enumerate(headers):
            hl = header.lower()
            match = None
            for fname, field in model_fields.items():
                if hl == fname.lower():
                    match = fname
                    break
            if not match:
                for fname, field in model_fields.items():
                    vn = str(field.verbose_name).lower() if field.verbose_name else ""
                    if hl == vn:
                        match = fname
                        break
            if not match and hl == "id":
                match = "id"
            col_map[col_idx] = match

        for row_idx, row in enumerate(data_rows, 2):
            try:
                obj_data = {}
                skip_row = False
                for col_idx, value in enumerate(row):
                    field_name = col_map.get(col_idx)
                    if not field_name:
                        continue
                    if value is None or str(value).strip() == "":
                        continue

                    field = model_fields.get(field_name)
                    if not field:
                        obj_data[field_name] = str(value)
                        continue

                    ftype = field.get_internal_type()
                    val = self._convert_value(value, ftype, field, row_idx, errors)
                    if val is None:
                        skip_row = True
                        break
                    obj_data[field_name] = val

                if skip_row or not obj_data:
                    continue

                with transaction.atomic():
                    obj_id = obj_data.pop("id", None)
                    if obj_id:
                        try:
                            instance = self.model.objects.get(pk=obj_id)
                            for key, val in obj_data.items():
                                setattr(instance, key, val)
                            instance.save()
                            updated += 1
                            continue
                        except self.model.DoesNotExist:
                            obj_data["id"] = obj_id
                    self.model.objects.create(**obj_data)
                    created += 1

            except Exception as e:
                errors.append(f"Fila {row_idx}: {str(e)}")

        return created, updated, errors

    def _convert_value(self, value, ftype, field, row_idx, errors):
        if ftype == "ForeignKey":
            resolved = self._resolve_fk(value, field)
            if resolved is None:
                errors.append(f"Fila {row_idx}: No se encontró '{value}' para '{field.name}'")
            return resolved
        if ftype in ("IntegerField", "AutoField", "BigIntegerField", "SmallIntegerField", "PositiveIntegerField", "PositiveSmallIntegerField", "BigAutoField", "SmallAutoField"):
            try:
                return int(float(str(value).replace(",", ".")))
            except (ValueError, TypeError):
                errors.append(f"Fila {row_idx}: '{value}' no es un número válido para '{field.name}'")
                return None
        if ftype == "FloatField":
            try:
                return float(str(value).replace(",", "."))
            except (ValueError, TypeError):
                errors.append(f"Fila {row_idx}: '{value}' no es un número decimal válido para '{field.name}'")
                return None
        if ftype in ("BooleanField", "NullBooleanField"):
            if isinstance(value, bool):
                return value
            return str(value).lower() in ("si", "yes", "true", "1", "verdadero")
        if ftype in ("CharField", "TextField", "SlugField", "URLField", "EmailField"):
            return str(value)
        if ftype == "ImageField":
            return None
        return str(value)

    def _resolve_fk(self, value, field):
        related = field.remote_field.model
        try:
            return related.objects.get(pk=int(value))
        except (ValueError, TypeError):
            pass
        for str_field in ("name", "title", "code"):
            if hasattr(related, str_field):
                kwargs = {f"{str_field}__iexact": str(value)}
                obj = related.objects.filter(**kwargs).first()
                if obj:
                    return obj
        return None
