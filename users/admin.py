from django.contrib import admin
from codensolar.admin import admin_site
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from allauth.socialaccount.models import SocialAccount
from products.admin_utils import ExportExcelMixin

# traer los de social


class UserAdmin(ExportExcelMixin, BaseUserAdmin):
    list_display = ['id', 'username', 'email', 'name', 'lastname', 'get_telephone', 'department', 'city', 'is_staff', 'is_active']
    search_fields = ['email', 'name', 'lastname']
    list_filter = ['is_staff', 'is_active']
    ordering = ['email']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': (('name', 'lastname'), 'email', ('telephone',), ('department', 'city'))}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'name', 'lastname', 'password1', 'password2'),
        }),
    )
    list_select_related = ['department', 'city']

    @admin.display(description='Teléfono')
    def get_telephone(self, obj):
        if obj.telephone:
            return str(obj.telephone)
        return '—'

class SocialAccountAdmin(ExportExcelMixin, admin.ModelAdmin):
    list_display = ['id', 'user', 'provider', 'uid']
    search_fields = ['user__email', 'provider', 'uid']
    list_filter = ['provider']
    ordering = ['user__email']


admin_site.register(User, UserAdmin)
admin_site.register(SocialAccount, SocialAccountAdmin)
