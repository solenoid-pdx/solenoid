"""solenoid URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from solenoid_app.views import indexView, line_chart, line_chart_json, calculate
# from django.contrib import admin
from django.urls import path, include
#from .views import line_chart, line_chart_json
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    # path('admin/', admin.site.urls, name='adminUrl'),
    path('', indexView, name='indexUrl'),
    path('chart', line_chart, name='line_chart'),
    path('chartJSON', line_chart_json, name='line_chart_json'),
    path('calculate', calculate, name='calculate')
]

urlpatterns += staticfiles_urlpatterns()