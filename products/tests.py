from io import BytesIO
from django.test import TestCase
from django.urls import reverse
from django.core.files.base import ContentFile
from PIL import Image, ImageOps
from .models import CarouselSlide


class ReactCotizadorLoginRedirectTests(TestCase):
    def test_anonymous_user_redirects_to_custom_login(self):
        response = self.client.get(reverse('Products_app:cotizador-solar'))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, '/user/login?next=/products/cotizador-solar')


class CarouselSlideImageProcessingTests(TestCase):
    def _make_test_image(self, width, height, color=(70, 130, 180)):
        img = Image.new('RGB', (width, height), color)
        buf = BytesIO()
        img.save(buf, format='JPEG')
        buf.seek(0)
        return ContentFile(buf.read())

    def test_save_generates_small_and_large(self):
        img_file = self._make_test_image(1920, 1080)
        slide = CarouselSlide.objects.create(
            image=img_file,
            title='Test',
            description='Test description',
        )
        slide.refresh_from_db()
        self.assertIn('_small', slide.image_small.name, f'Expected _small in name, got {slide.image_small.name}')
        self.assertIn('_large', slide.image_large.name, f'Expected _large in name, got {slide.image_large.name}')
        self.assertTrue(slide.image_small.storage.exists(slide.image_small.name))
        self.assertTrue(slide.image_large.storage.exists(slide.image_large.name))

    def test_small_image_max_width_800(self):
        img_file = self._make_test_image(2000, 1500)
        slide = CarouselSlide.objects.create(image=img_file)
        slide.refresh_from_db()
        small = Image.open(slide.image_small.path)
        self.assertLessEqual(small.width, 800, f'Small image width {small.width} > 800')
        expected_height = 800 * 1500 / 2000
        self.assertAlmostEqual(small.height, expected_height, delta=1)

    def test_large_image_is_1920x540(self):
        img_file = self._make_test_image(3000, 2000)
        slide = CarouselSlide.objects.create(image=img_file)
        slide.refresh_from_db()
        large = Image.open(slide.image_large.path)
        self.assertEqual(large.size, (1920, 540), f'Large image size {large.size} != (1920, 540)')

    def test_large_image_extends_taller_images_with_reflect(self):
        img_file = self._make_test_image(800, 1200)
        slide = CarouselSlide.objects.create(image=img_file)
        slide.refresh_from_db()
        large = Image.open(slide.image_large.path)
        self.assertEqual(large.size, (1920, 540))

    def test_large_image_crops_wider_images(self):
        img_file = self._make_test_image(3000, 600)
        slide = CarouselSlide.objects.create(image=img_file)
        slide.refresh_from_db()
        large = Image.open(slide.image_large.path)
        self.assertEqual(large.size, (1920, 540))

    def test_serializer_returns_image_urls(self):
        from products.serializers import CarouselSlideSerializer
        img_file = self._make_test_image(1920, 1080)
        slide = CarouselSlide.objects.create(image=img_file)
        serializer = CarouselSlideSerializer(slide)
        data = serializer.data
        self.assertIn('image_small', data)
        self.assertIn('image_large', data)
        self.assertIsNotNone(data['image_small'])
        self.assertIsNotNone(data['image_large'])
        self.assertIn('_small', data['image_small'], f'URL missing _small: {data["image_small"]}')
        self.assertIn('_large', data['image_large'], f'URL missing _large: {data["image_large"]}')
