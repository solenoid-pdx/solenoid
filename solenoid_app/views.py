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
            data['toGraph'] = form.cleaned_data['toGraph']
            compute = data['compute']

            data[compute] = None
            data[compute] = solenoid_solve(data['voltage'], data['length'], data['r_not'],
                                           data['r_a'], data['awg'], data['x'], data['force'])

            for k, v in data.items():
                data[k] = str(v)

            return JsonResponse(data, safe=False)

def voltageChart(request):
    labels = []
    x = ''
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
        form = DataSetForm(request.POST)
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
                x = 'Voltage'    
                for volts in range(0, 15):
                    labels.append(volts)
                    graph.append(str(round(solenoid_solve(volts, data['length'], data['r_not'], data['r_a'], data['awg'], data['x'], data['force']),2)))

            elif data['toGraph'] == 'length':
                x = 'Length (mm)'
                for length in range(5, 26):
                    labels.append(length)
                    graph.append(str(round(solenoid_solve(data['voltage'], length, data['r_not'], data['r_a'], data['awg'], data['x'], data['force']),2)))   

            elif data['toGraph'] == 'r_not':
                x = 'r_not'
                for r_not in np.around(np.arange(1.0, 5.0, 0.1),decimals=2).astype(float):
                    labels.append(r_not)
                    graph.append(str(round(solenoid_solve(data['voltage'], data['length'], r_not, data['r_a'], data['awg'], data['x'], data['force']),2)))

            elif data['toGraph'] == 'r_a':
                x = 'r_a'
                for r_a in np.around(np.arange(1.0, 5.0, 0.1),decimals=2).astype(float):
                    labels.append(r_a)
                    graph.append(str(round(solenoid_solve(data['voltage'], data['length'], data['r_not'], r_a, data['awg'], data['x'], data['force']),2)))
            
            elif data['toGraph'] == 'x':
                x = 'x'
                length = int(data['length']) + 1
                for i in range(0, length):
                    labels.append(i)
                    graph.append(str(round(solenoid_solve(data['voltage'], data['length'], data['r_not'], data['r_a'], data['awg'], i, data['force']),2)))

            elif data['toGraph'] == 'awg':
                x = 'American Wire Gauge'
                for i in list(map(str, range(26, 41))):
                    labels.append(i)
                    graph.append(str(round(solenoid_solve(data['voltage'], data['length'], data['r_not'], data['r_a'], i, data['x'], data['force']),2)))
            else: #defaults to voltage for now, will change, possibly don't need
                x = 'Voltage'
                for volts in range(0, 51):
                    labels.append(volts)
                    graph.append(str(round(solenoid_solve(volts, data['length'], data['r_not'], data['r_a'], data['awg'], data['x'], data['force']),2)))

    return JsonResponse(data={
        'labels': labels,
        'data': graph,
        'x' : x,
    })
