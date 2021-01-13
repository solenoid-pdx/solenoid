from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import JsonResponse
from subprocess import check_output
from django.views.generic import TemplateView
from chartjs.views.lines import BaseLineChartView
from .forms import DataSetForm
from solenoid_app.middlewares.test import testFunc
import os
import time
# Create your views here.


def indexView(request):
    return render(request, 'index.html')

class LineChartJSONView(BaseLineChartView):
    def get_labels(self):
        """Return 7 labels for the x-axis."""
        return ["January", "February", "March", "April", "May", "June", "July"]

    def get_providers(self):
        """Return names of datasets."""
        return ["Central", "Eastside", "Westside"]

    def get_data(self):
        """Return 3 datasets to plot."""

        return [[75, 44, 92, 11, 44, 95, 35],
                [41, 92, 18, 3, 73, 87, 92],
                [87, 21, 94, 3, 90, 13, 65]]

line_chart = TemplateView.as_view(template_name='line_chart.html')
line_chart_json = LineChartJSONView.as_view()

def calculate(request):
    if (request.method == "POST"):
        form = DataSetForm(request.POST)
        if form.is_valid():
            voltage = form.cleaned_data['V']
            len = form.cleaned_data['L']
            turns = form.cleaned_data['N']
            alpha = form.cleaned_data['ALPHA']
            gamma = form.cleaned_data['GAMMA']
            r_not = form.cleaned_data['R0']
            r_a = form.cleaned_data['Ra']
            x = form.cleaned_data['X']
            force = form.cleaned_data['F']

            print (voltage, len, turns, alpha, gamma, r_not, r_a, x, force)
            # testFunc()
            res = request.POST
            print(res)
        return JsonResponse(res, safe=False)