from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import UserManager
# Create your models here.


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True, blank=True)
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    telephone = models.IntegerField(blank=True, null=True)
    password = models.CharField(max_length=128)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    codregistro = models.CharField(max_length=6, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    objects = UserManager()
    
    def __str__(self):
        return self.username or self.email or self.name
