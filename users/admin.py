from django.contrib import admin
from codensolar.admin import admin_site
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from allauth.socialaccount.models import SocialAccount

# traer los de social


class UserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'email', 'name', 'lastname', 'telephone', 'is_staff', 'is_active']
    search_fields = ['email', 'name', 'lastname']
    list_filter = ['is_staff', 'is_active']
    ordering = ['email']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('name', 'lastname', 'telephone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'name', 'lastname', 'password1', 'password2'),
        }),
    )

class SocialAccountAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'provider', 'uid']
    search_fields = ['user__email', 'provider', 'uid']
    list_filter = ['provider']
    ordering = ['user__email']


admin_site.register(User, UserAdmin)
admin_site.register(SocialAccount, SocialAccountAdmin)
