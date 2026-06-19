from rest_framework import serializers
from .models import Products, Category, ShowCategory, CarouselSlide

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Products
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ShowCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowCategory
        fields = '__all__'

class CarouselSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselSlide
        fields = ['id', 'image', 'image_small', 'image_large', 'title', 'description', 'order', 'is_active', 'uploaded_at']
