import os, sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "codensolar.settings")
sys.path.insert(0, "/app/codensolar")
import django; django.setup()
from django.db import connection
with connection.cursor() as c:
    c.execute("SELECT udt_name FROM information_schema.columns WHERE table_name = %s AND column_name = %s", ["users_user", "telephone"])
    print(c.fetchone())
