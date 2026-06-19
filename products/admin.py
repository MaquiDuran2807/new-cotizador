from django.contrib import admin
from codensolar.admin import admin_site
from .models import *


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'perdida', 'tiempo_uso']
    search_fields = ['name']
    list_filter = ['perdida']


class ShowCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'category', 'name']
    search_fields = ['name', 'category__name']


class ProductsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'consume']
    search_fields = ['name', 'category__name']
    list_filter = ['category']


class SolarPanelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'production', 'voltage']
    search_fields = ['name']
    list_filter = ['category', 'voltage']


class BatteryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'capacity', 'voltage']
    search_fields = ['name']
    list_filter = ['category', 'voltage']


class ReguladoresAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'amperios']
    search_fields = ['name']
    list_filter = ['category']


class InversoresAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'vatios']
    search_fields = ['name']
    list_filter = ['category']


class OtrosAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class VoltageAdmin(admin.ModelAdmin):
    list_display = ['id', 'voltage']


class BreakersAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'amps']
    search_fields = ['name']
    list_filter = ['category']


class RubberizedCablesAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'supported_amperage']
    search_fields = ['name']
    list_filter = ['category']


class VehicleCablesAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'supported_amperage']
    search_fields = ['name']
    list_filter = ['category']


class PanelSupportsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class BatterySupportsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class GroundSecurityKitsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class ConnectorsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class TerminalsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class CentralizedModuleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class UnityPowerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'max_ampers_supported', 'min_ampers_supported']
    search_fields = ['name']
    list_filter = ['category']


class ElectricMaterialsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price']
    search_fields = ['name']
    list_filter = ['category']


class KitHogarAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price']
    search_fields = ['name']
    list_filter = ['price']

class CarouselSlideAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'order', 'is_active', 'uploaded_at']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']


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
