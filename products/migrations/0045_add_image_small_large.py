from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0044_carouselslide'),
    ]

    operations = [
        migrations.AddField(
            model_name='carouselslide',
            name='image_large',
            field=models.ImageField(blank=True, editable=False, null=True, upload_to='media/carousel/large'),
        ),
        migrations.AddField(
            model_name='carouselslide',
            name='image_small',
            field=models.ImageField(blank=True, editable=False, null=True, upload_to='media/carousel/thumbs'),
        ),
    ]
