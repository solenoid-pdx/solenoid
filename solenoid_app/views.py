from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import JsonResponse
from subprocess import check_output
from django.views.generic import TemplateView
from chartjs.views.lines import BaseLineChartView
from .forms import DataSetForm
from solenoid_app.solenoid_math.solver import solenoid_solve
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

def formHandle(request):
    data = {
        'voltage': '',
        'length': '',
        'turns': '',
        'alpha': '',
        'gamma': '',
        'r_not': '',
        'r_a': '',
        'x': '',
        'force': '',
        'awg': '',
        'compute': ''
    }

    if (request.method == "POST"):
        form = DataSetForm(request.POST)
        if form.is_valid():
            data['voltage'] = form.cleaned_data['voltage']
            data['length'] = form.cleaned_data['length']
            data['turns'] = form.cleaned_data['turns']
            data['alpha'] = form.cleaned_data['alpha']
            data['gamma'] = form.cleaned_data['gamma']
            data['r_not'] = form.cleaned_data['r_not']
            data['r_a'] = form.cleaned_data['r_a']
            data['x'] = form.cleaned_data['x']
            data['force'] = form.cleaned_data['force']
            data['awg'] = form.cleaned_data['awg']
            data['compute'] = form.cleaned_data['compute']
            compute = data['compute']

            data[compute] = None
            data[compute] = solenoid_solve(data['voltage'], data['length'], data['r_not'],
                                           data['r_a'], data['awg'], data['x'], data['force'])

            for k, v in data.items():
                data[k] = str(v)

            return JsonResponse(data, safe=False)