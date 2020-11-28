from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from subprocess import check_output
import os
import time
# Create your views here.


def index(request):
    return render(request, 'index.html')



