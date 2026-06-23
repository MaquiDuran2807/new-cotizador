from django.contrib import admin
from codensolar.admin import admin_site
from .models import *
from .admin_utils import ExportExcelMixin


class CategoryAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'perdida', 'tiempo_uso']
    search_fields = ['name']
    list_filter = ['perdida']


class ShowCategoryAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'category', 'name']
    search_fields = ['name', 'category__name']


class ProductsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'show_image', 'name', 'category', 'price', 'consume']
    search_fields = ['name', 'category__name']
    list_filter = ['category']


class SolarPanelAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'production', 'voltage']
    search_fields = ['name']
    list_filter = ['category', 'voltage']


class BatteryAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'capacity', 'voltage']
    search_fields = ['name']
    list_filter = ['category', 'voltage']


class ReguladoresAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'amperios']
    search_fields = ['name']
    list_filter = ['category']


class InversoresAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'vatios']
    search_fields = ['name']
    list_filter = ['category']


class OtrosAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class VoltageAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'voltage']


class BreakersAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'amps']
    search_fields = ['name']
    list_filter = ['category']


class RubberizedCablesAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'supported_amperage']
    search_fields = ['name']
    list_filter = ['category']


class VehicleCablesAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'supported_amperage']
    search_fields = ['name']
    list_filter = ['category']


class PanelSupportsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class BatterySupportsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class GroundSecurityKitsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class ConnectorsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class TerminalsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class CentralizedModuleAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class UnityPowerAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'max_ampers_supported', 'min_ampers_supported']
    search_fields = ['name']
    list_filter = ['category']


class ElectricMaterialsAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class KitHogarAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'name', 'price']
    search_fields = ['name']
    list_filter = ['price']

class CarouselSlideAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'title', 'order', 'is_active', 'uploaded_at']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']


class DepartmentAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['code', 'name']
    search_fields = ['name', 'code']
    ordering = ['name']


class MunicipalityAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['code', 'name', 'department', 'latitude', 'longitude']
    search_fields = ['name', 'department__name']
    list_filter = ['department']
    ordering = ['department__name', 'name']


admin_site.register(Category, CategoryAdmin)
admin_site.register(Products, ProductsAdmin)
admin_site.register(SolarPanel, SolarPanelAdmin)
admin_site.register(Battery, BatteryAdmin)
admin_site.register(Reguladores, ReguladoresAdmin)
admin_site.register(Inversores, InversoresAdmin)
admin_site.register(Otros, OtrosAdmin)
admin_site.register(Voltage, VoltageAdmin)
admin_site.register(Breakers, BreakersAdmin)
admin_site.register(RubberizedCables, RubberizedCablesAdmin)
admin_site.register(VehicleCables, VehicleCablesAdmin)
admin_site.register(PanelSupports, PanelSupportsAdmin)
admin_site.register(BatterySupports, BatterySupportsAdmin)
admin_site.register(CentralizedModule, CentralizedModuleAdmin)
admin_site.register(UnityPower, UnityPowerAdmin)
admin_site.register(ElectricMaterials, ElectricMaterialsAdmin)
admin_site.register(KitHogar, KitHogarAdmin)
admin_site.register(Connectors, ConnectorsAdmin)
admin_site.register(Terminals, TerminalsAdmin)
admin_site.register(GroundSecurityKits, GroundSecurityKitsAdmin)
admin_site.register(ShowCategory, ShowCategoryAdmin)
admin_site.register(CarouselSlide, CarouselSlideAdmin)
admin_site.register(Department, DepartmentAdmin)
admin_site.register(Municipality, MunicipalityAdmin)
