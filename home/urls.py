
from django.urls import path
from .views import *


urlpatterns = [
    path('', Home_View.as_view(), name='home'),
    
]