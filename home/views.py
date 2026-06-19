from django.shortcuts import render
from django.views.generic import ListView, View


# Create your views here.

class Home_View(ListView):
    template_name = 'home.html'
    queryset = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

