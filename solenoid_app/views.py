from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import JsonResponse
from subprocess import check_output
from django.views.generic import TemplateView
from chartjs.views.lines import BaseLineChartView
from .forms import DataSetForm, GraphForm 
from solenoid_app.solenoid_math.solver import solenoid_solve
import os
import time
import numpy as np
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
        'compute': '',
        'toGraph': ''
    }

    if (request.method == "POST"):
        form = GraphForm(request.POST)
        print(request.POST)
        if form.is_valid():
            data['voltage'] = form.cleaned_data['voltage']
            data['length'] = form.cleaned_data['length']
            data['r_not'] = form.cleaned_data['r_not']
            data['r_a'] = form.cleaned_data['r_a']
            data['x'] = form.cleaned_data['x']
            data['force'] = form.cleaned_data['force']
            data['awg'] = form.cleaned_data['awg']
            data['compute'] = form.cleaned_data['compute']
            data['toGraph'] = form.cleaned_data['toGraph']
            compute = data['compute']

            data['compute'] = None
            data['force'] = None

            if data['toGraph'] == 'voltage':
                for volts in range(0, 51):
                    labels.append(volts)
                    graph.append(str(round(solenoid_solve(volts, data['length'], data['r_not'], data['r_a'], data['awg'], data['x'], data['force']),2)))

            elif data['toGraph'] == 'length':
                for length in range(5, 26):
                    labels.append(length)
                    graph.append(str(round(solenoid_solve(data['voltage'], length, data['r_not'], data['r_a'], data['awg'], data['x'], data['force']),2)))   

            elif data['toGraph'] == 'r_not':
                for r_not in np.around(np.arange(1.0, 5.0, 0.1),decimals=2).astype(float):
                    labels.append(r_not)
                    graph.append(str(round(solenoid_solve(data['voltage'], data['length'], r_not, data['r_a'], data['awg'], data['x'], data['force']),2)))

            elif data['toGraph'] == 'r_a':
                for r_a in np.around(np.arange(1.0, 5.0, 0.1),decimals=2).astype(float):
                    labels.append(r_a)
                    graph.append(str(round(solenoid_solve(data['voltage'], data['length'], data['r_not'], r_a, data['awg'], data['x'], data['force']),2)))
            else: #defaults to voltage for now, will change, possibly don't need
                for volts in range(0, 51):
                    labels.append(volts)
                    graph.append(str(round(solenoid_solve(volts, data['length'], data['r_not'], data['r_a'], data['awg'], data['x'], data['force']),2)))

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