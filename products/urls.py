from django.urls import path
from .views import *

app_name = 'Products_app'

urlpatterns = [
    path('all', ProductView.as_view(), name='products-all'),
    path('pdf', PdfView.as_view(), name='pdf'),
    path('pdf-page', PdfViewPage.as_view(), name='pdf'),
    path('quote', PdfViewPage.as_view(), name='pdfPage'),
    path('sendQuote', SendEmail.as_view(), name='email'),
    path('show_Category', ShowCategoryView.as_view(), name='show_Category'),
    path('shopping_car/<int:id>', ShoppingCar.as_view(), name='shopping_car'),
    path('vista_prueba', vistaprueba.as_view(), name='vista_prueba'),
    path('pdf_vista',PdfViewPage.as_view(), name='pdf_vista'),
    path('gen_pdf', GeneratePdf.as_view(), name='gen_pdf'),
    path('show_video', ShowVideos.as_view(), name='show_video'),
    path('cotizador-react', ReactCotizadorView.as_view(), name='cotizador-react'),
    path('api/products', ProductAPI.as_view(), name='products-api'),
    path('api/categories', CategoryAPI.as_view(), name='categories-api'),
    path('api/show-categories', ShowCategoryAPI.as_view(), name='show-categories-api'),
    path('api/me', CurrentUserAPI.as_view(), name='current-user-api'),
    path('api/carousel-slides', CarouselSlideAPI.as_view(), name='carousel-slides-api'),
]