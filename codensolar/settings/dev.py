from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1', '10.0.2.2', '192.168.39.157']
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://*.127.0.0.1',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
