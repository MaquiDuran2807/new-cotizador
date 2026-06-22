from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0047_department_municipality"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AlterField(
                    model_name="products",
                    name="name",
                    field=models.CharField(max_length=100),
                ),
                migrations.AlterField(
                    model_name="products",
                    name="category",
                    field=models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=models.deletion.CASCADE,
                        to="products.category",
                    ),
                ),
                migrations.AlterField(
                    model_name="products",
                    name="caracteristicas",
                    field=models.CharField(blank=True, max_length=200, null=True),
                ),
            ],
            database_operations=[],
        ),
    ]
