from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import JsonResponse
from subprocess import check_output
from django.views.generic import TemplateView
from chartjs.views.lines import BaseLineChartView
from .forms import DataSetForm, GraphForm
from solenoid_app.solenoid_math.solver import solenoid_solve, solenoid_range
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
        'r0': '',
        'ra': '',
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
            data['r0'] = form.cleaned_data['r0']
            data['ra'] = form.cleaned_data['ra']
            data['x'] = form.cleaned_data['x']
            data['force'] = form.cleaned_data['force']
            data['awg'] = form.cleaned_data['awg']
            data['compute'] = form.cleaned_data['compute']
            compute = data['compute']

            data[compute] = None
            data[compute] = solenoid_solve(data['voltage'], data['length'], data['r0'],
                                           data['ra'], data['awg'], data['x'], data['force'])

            for k, v in data.items():
                data[k] = str(v)

            return JsonResponse(data, safe=False)

def voltageChart(request):
    sigFigs = 2
    labels = []
    x = ''
    graph = []
    data = {
        'voltage': '',
        'length': '',
        'r0': '',
        'ra': '',
        'x': '',
        'force': '',
        'awg': '',
        'compute': '',
        'xGraph': '',
        'xStart': '',
        'xEnd': '',
    }

    if (request.method == "POST"):
        form = GraphForm(request.POST)
        # print(request.POST)
        if form.is_valid():
            data['voltage'] = form.cleaned_data['voltage']
            data['length'] = form.cleaned_data['length']
            data['r0'] = form.cleaned_data['r0']
            data['ra'] = form.cleaned_data['ra']
            data['x'] = form.cleaned_data['x']
            data['force'] = form.cleaned_data['force']
            data['awg'] = form.cleaned_data['awg']
            data['compute'] = form.cleaned_data['compute']
            data['xGraph'] = form.cleaned_data['xGraph']
            data['xStart'] = form.cleaned_data['xStart']
            data['xEnd'] = form.cleaned_data['xEnd']
            compute = data['compute']
            print(compute)
            data[compute.lower()] = None
            
            if data['xGraph'] == 'voltage':
                x = 'Voltage' 
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], data['xGraph'], data['xStart'], data['xEnd'], 1.0):
                    labels.append(k)
                    graph.append(round(v,sigFigs))

            elif data['xGraph'] == 'length':
                x = 'Length (mm)'
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], data['xGraph'], data['xStart'], data['xEnd'], 1.0):
                    labels.append(k)
                    graph.append(round(v,sigFigs))  

            elif data['xGraph'] == 'r0':
                x = 'r0'
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], data['xGraph'], data['xStart'], data['xEnd'], 0.1):
                  labels.append(round(k,sigFigs))
                  graph.append(v)                  

            elif data['xGraph'] == 'ra':
                x = 'ra'
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], data['xGraph'], data['xStart'], data['xEnd'], 0.1):
                  labels.append(round(k,sigFigs))
                  graph.append(v)                 
           
            elif data['xGraph'] == 'x':
                x = 'x'
                length = float(data['length']) + 1.0
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], data['xGraph'], data['xStart'], length, 1.0):
                  labels.append(k)
                  graph.append(round(v,sigFigs))  
                  
            elif data['xGraph'] == 'awg':
                x = 'American Wire Gauge'
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], "gauge", data['xStart'], data['xEnd'], 0.1):
                  labels.append(k)
                  graph.append(round(v,sigFigs))  

            elif data['xGraph'] == 'force':
                x = 'Force'
                for k,v in solenoid_range(data['voltage'],data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force'], data['xGraph'], data['xStart'], data['xEnd'], 1.0):
                  labels.append(k)
                  graph.append(round(v,sigFigs))  

            else: 
                x = 'Voltage' 
                for volts in range(0, 51):
                    labels.append(volts)
                    graph.append(str(round(solenoid_solve(volts, data['length'], data['r0'], data['ra'], data['awg'], data['x'], data['force']),sigFigs)))

    return JsonResponse(data={
        'labels': labels,
        'data': graph,
        'x' : x,
        'y' : compute,
    })
