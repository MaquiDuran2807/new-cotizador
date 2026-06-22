from io import BytesIO
from django.db import models
from django.core.files.base import ContentFile
from PIL import Image, ImageOps


class Department(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Municipality(models.Model):
    code = models.CharField(max_length=7, unique=True)
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='municipalities')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.department.name})"

class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    perdida= models.FloatField(blank=True, null=True, default=39)
    tiempo_uso = models.IntegerField(default=6)
    image = models.ImageField(upload_to='media/category',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class ShowCategory (models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name= models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.category.name

class Products (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    voltage = models.ManyToManyField("products.Voltage")
    description = models.TextField()
    consume = models.IntegerField()
    caracteristicas = models.CharField(max_length=50)
    image = models.ImageField(upload_to='media/Otros')

    def __str__(self):
        return str(str(self.id))+") "+self.name
        
class Otros (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='media/otros')

    def __str__(self):
        return str(self.id) +") "+self.name
    
class Voltage(models.Model):
    """
    this is an small table to save the voltages
    Args:
        models (_type_): _description_
    """
    voltage = models.IntegerField()
    
    def __str__(self):
        return str(self.voltage)
    

# ===========================================================================

class SolarPanel (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    voltage = models.ForeignKey("products.Voltage", on_delete=models.CASCADE)
    description = models.TextField()
    production = models.IntegerField()
    image = models.ImageField (upload_to='media/SolarPanel',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name

class Battery (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    voltage = models.ForeignKey("products.Voltage", on_delete=models.CASCADE)
    description = models.TextField()
    capacity = models.IntegerField()
    image = models.ImageField(upload_to='media/Battery',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class Reguladores (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amperios = models.IntegerField()
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/Reguladores',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class Inversores (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    vatios = models.IntegerField()
    price = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='media/Inversores')

    def __str__(self):
        return str(self.id) +") "+self.name
    
class soportes (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='media/soportes')

    def __str__(self):
        return str(self.id) +") "+self.name

class UnidadPotencia (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='media/UnidadPotencia')

    def __str__(self):
        return str(self.id) +") "+self.name    

class Breakers (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    amps = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/breakers',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class RubberizedCables (models.Model):
    name = models.CharField(max_length=50)
    supported_amperage = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/RubberizedCables',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class VehicleCables (models.Model):
    name = models.CharField(max_length=50)
    supported_amperage = models.IntegerField(blank=True,null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/VehicleCables',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class PanelSupports (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/PanelSupport',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class BatterySupports (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/BatterySupports',blank=True, null=True)
    
    def __str__(self):
        return str(self.id) +") "+self.name

class GroundSecurityKits (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/GroundSecurityKits',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name
    
class Connectors (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/Connectors',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name + f" ${self.price}"
    
class Terminals (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/Terminals',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name + f" ${self.price}"
    
class CentralizedModule (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/CentralizedModule',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name + f" ${self.price}"
    
class UnityPower (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='unity_powers')
    battery_kids_supported = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='unity_powers_battery_kids')
    max_ampers_supported = models.IntegerField()
    min_ampers_supported = models.IntegerField(blank=True, null=True)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/UnityPower',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name + f" ${self.price}"
    
class ElectricMaterials (models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='media/UnityPower',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name + f" ${self.price}"


class CarouselSlide(models.Model):
    image = models.ImageField(upload_to='media/carousel')
    image_small = models.ImageField(upload_to='media/carousel/thumbs', blank=True, null=True, editable=False)
    image_large = models.ImageField(upload_to='media/carousel/large', blank=True, null=True, editable=False)
    title = models.CharField(max_length=200, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-uploaded_at']

    def save(self, *args, **kwargs):
        # Leer bytes de la imagen desde self.__dict__ para capturar el ContentFile
        # incluso cuando no tiene nombre (self.image es falsy, ej. tests).
        img_bytes = None
        raw = self.__dict__.get('image')
        if raw is not None:
            try:
                raw.seek(0)
                img_bytes = raw.read()
            except Exception:
                pass

        super().save(*args, **kwargs)

        if not img_bytes:
            return

        stem = f"slide_{self.id}"
        changed = False

        # --- Versión pequeña: max 800px ancho, mantener proporción, JPEG 85 ---
        try:
            pil = Image.open(BytesIO(img_bytes))
            w, h = pil.size
            if w > 800:
                ratio = 800 / w
                new_size = (800, max(1, int(h * ratio)))
                pil = pil.resize(new_size, Image.LANCZOS)
            buf = BytesIO()
            pil.save(buf, format='JPEG', quality=85, optimize=True)
            small_name = f"{stem}_small.jpg"
            self.image_small.save(small_name, ContentFile(buf.getvalue()), save=False)
            changed = True
        except Exception:
            pass

        # --- Versión grande: 1920x540, extender con efecto espejo (BORDER_REFLECT) ---
        try:
            pil = Image.open(BytesIO(img_bytes)).convert('RGB')
            target_w, target_h = 1920, 540
            w, h = pil.size
            scale = min(target_w / w, target_h / h)
            new_w = int(w * scale)
            new_h = int(h * scale)
            resized = pil.resize((new_w, new_h), Image.LANCZOS)

            canvas = Image.new('RGB', (target_w, target_h))
            left = (target_w - new_w) // 2
            top = (target_h - new_h) // 2

            if left > 0:
                edge = resized.crop((0, 0, 1, new_h)).transpose(Image.FLIP_LEFT_RIGHT)
                tile = edge.resize((left, new_h), Image.NEAREST)
                canvas.paste(tile, (0, top))
            right_pad = target_w - new_w - left
            if right_pad > 0:
                edge = resized.crop((new_w - 1, 0, new_w, new_h)).transpose(Image.FLIP_LEFT_RIGHT)
                tile = edge.resize((right_pad, new_h), Image.NEAREST)
                canvas.paste(tile, (left + new_w, top))
            if top > 0:
                edge = resized.crop((0, 0, new_w, 1)).transpose(Image.FLIP_TOP_BOTTOM)
                tile = edge.resize((new_w, top), Image.NEAREST)
                canvas.paste(tile, (left, 0))
            bottom_pad = target_h - new_h - top
            if bottom_pad > 0:
                edge = resized.crop((0, new_h - 1, new_w, new_h)).transpose(Image.FLIP_TOP_BOTTOM)
                tile = edge.resize((new_w, bottom_pad), Image.NEAREST)
                canvas.paste(tile, (left, top + new_h))

            canvas.paste(resized, (left, top))

            buf = BytesIO()
            canvas.save(buf, format='JPEG', quality=85, optimize=True)
            large_name = f"{stem}_large.jpg"
            self.image_large.save(large_name, ContentFile(buf.getvalue()), save=False)
            changed = True
        except Exception:
            pass

        if changed:
            super().save(update_fields=['image_small', 'image_large'])

    def __str__(self):
        return f"Slide {self.id} - {self.title or 'sin título'}"

# ===========================================================================

class KitHogar (models.Model):
    name = models.CharField(max_length=50)
    productos = models.ManyToManyField(Products, related_name='kit_hogar')
    panel= models.ForeignKey(SolarPanel, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    panel_cantidad = models.IntegerField(blank=True,null=True)
    bateria = models.ForeignKey(Battery, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    bateria_cantidad = models.IntegerField(blank=True,null=True)
    regulador= models.ForeignKey(Reguladores, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    breakers= models.ForeignKey(Breakers, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    breakers_cantidad = models.IntegerField(default=3,blank=True,null=True)
    cable= models.ForeignKey(RubberizedCables, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    cable_cantidad = models.IntegerField(default=10,blank=True,null=True)
    cable_vehicular= models.ForeignKey(VehicleCables, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    cablevehicular_cantidad = models.IntegerField(default=10,blank=True,null=True)
    panel_suport= models.ForeignKey(PanelSupports, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    panel_suport_cantidad = models.IntegerField(blank=True,null=True)
    unidad_de_potencia= models.ForeignKey(UnityPower, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    modulo_centralizado= models.ForeignKey(CentralizedModule, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    puesta_tierra= models.ForeignKey(GroundSecurityKits, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    conectores= models.ForeignKey(Connectors, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    conectores_cantidad = models.IntegerField(blank=True,null=True)
    terminales= models.ForeignKey(Terminals, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    material_electrico= models.ForeignKey(ElectricMaterials, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    inversor= models.ForeignKey(Inversores, on_delete=models.CASCADE, related_name='kit_hogar',blank=True,null=True)
    price = models.IntegerField()
    image = models.ImageField(upload_to='media/KitHogar',blank=True, null=True)

    def __str__(self):
        return str(self.id) +") "+self.name + f" ${self.price}"