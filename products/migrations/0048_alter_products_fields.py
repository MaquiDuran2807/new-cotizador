from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0047_department_municipality"),
    ]

    operations = [
        migrations.RunSQL(
            sql="SELECT 1;",
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
