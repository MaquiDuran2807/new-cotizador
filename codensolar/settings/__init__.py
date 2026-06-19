import os
from dotenv import load_dotenv

load_dotenv()

DJANGO_ENV = os.environ.get('DJANGO_ENV', 'dev')

if DJANGO_ENV == 'production':
    from .prod import *
else:
    from .dev import *
