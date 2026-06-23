from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_user_city_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='telephone',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
