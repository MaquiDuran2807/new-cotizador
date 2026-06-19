from django.contrib.admin import AdminSite
from django.contrib import admin


class CodenSolarAdminSite(AdminSite):
    site_header = "CodenSolar"
    site_title = "CodenSolar"
    index_title = "Panel de Administración"
    site_url = "/"

    def get_app_list(self, request):
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


admin_site = CodenSolarAdminSite(name="admin")
