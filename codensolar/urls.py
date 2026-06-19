"""codensolar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from codensolar.admin import admin_site

# Ensure app admin modules are loaded
from products import admin as products_admin  # noqa
from users import admin as users_admin  # noqa
from home import admin as home_admin  # noqa

    
    

urlpatterns = [
    path('admin/', admin_site.urls),
    path('', include('home.urls')), # home app
    path('user/', include('users.urls')),
    path('products/', include('products.urls')),
    path('accounts/', include('allauth.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)