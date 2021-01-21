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



def formHandle(request):
    data = {
        'voltage': '',
        'length': '',
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

def voltageChart(request):
    labels = []
    graph = []
    data = {
        'voltage': '',
        'length': '',
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
            data['r_not'] = form.cleaned_data['r_not']
            data['r_a'] = form.cleaned_data['r_a']
            data['x'] = form.cleaned_data['x']
            data['force'] = form.cleaned_data['force']
            data['awg'] = form.cleaned_data['awg']
            data['compute'] = form.cleaned_data['compute']
            compute = data['compute']

            for i in range(2, 8):
                labels.append(i)
                graph.append(solenoid_solve(i, data['length'], data['r_not'],
                                        data['r_a'], data['awg'], data['x'], data['force']))

        
    return JsonResponse(data={
        'labels': labels,
        'data': graph,
    })

# Base Graph, Don't need just for testing
class LineChartJSONView(BaseLineChartView):
    #This will be from the formhandle, it will return each of these
    def get_labels(self):
        """Return 7 labels for the x-axis."""
        return ["2", "3", "3", "4", "5", "6", "7"]

    def get_providers(self):
        """Return names of datasets."""
        return ["Something", "Goes", "Here Later"]

    def get_data(data):
        """Return 3 datasets to plot."""

        return [[75, 44, 92, 11, 44, 95, 35],
                [41, 92, 18, 3, 73, 87, 92],
                [87, 21, 94, 3, 90, 13, 65]]

line_chart = TemplateView.as_view(template_name='line_chart.html')
line_chart_json = LineChartJSONView.as_view()