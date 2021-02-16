from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import JsonResponse
from subprocess import check_output
from django.views.generic import TemplateView
from chartjs.views.lines import BaseLineChartView
from .forms import DataSetForm, GraphForm
from solenoid_app.solenoid_math.solver import solenoid_convert, solenoid_range
from solenoid_app.solenoid_math.exceptions import *
from solenoid_app.solenoid_math import ureg
import os
import time
import numpy as np
# Create your views here.

def indexView(request):
    return render(request, 'index.html')


def formHandle(request):
    sig_figs = 5
    data = {
        'voltage': '',
        'length': '',
        'r0': '',
        'ra': '',
        'x': '',
        'force': '',
        'awg': '',
        'compute': '',
        'length_unit': '',
        'r0_unit': '',
        'ra_unit': '',
        'x_unit': '',
        'force_unit': ''
    }

    if request.method == "POST":
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
            data['length_unit'] = form.cleaned_data['length_unit']
            data['r0_unit'] = form.cleaned_data['r0_unit']
            data['ra_unit'] = form.cleaned_data['ra_unit']
            data['x_unit'] = form.cleaned_data['x_unit']
            data['force_unit'] = form.cleaned_data['force_unit']

            # convert to unit objects
            data['length'] = data['length'] * ureg(data['length_unit'])
            data['r0'] = data['r0'] * ureg(data['r0_unit'])
            data['ra'] = data['ra'] * ureg(data['ra_unit'])
            data['x'] = data['x'] * ureg(data['x_unit'])
            data['force'] = data['force'] * ureg(data['force_unit'])

            compute = data['compute']
            data[compute] = None

            if compute in ['length', 'r0', 'ra', 'x', 'force']:
                output_unit = data[compute + "_unit"]
            else:
                output_unit = None

            try:
                data[compute] = solenoid_convert(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                                 data['x'], data['force'], output_unit)

                data[compute] = round(data[compute], sig_figs)
            except NoSolution:
                data[compute] = "No Solution Found"

            for k, v in data.items():
                data[k] = str(v)

            return JsonResponse(data, safe=False)


def voltageChart(request):
    sig_figs = 5
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
        'length_unit': '',
        'r0_unit': '',
        'ra_unit': '',
        'x_unit': '',
        'force_unit': ''
    }

    if request.method == "POST":
        form = GraphForm(request.POST)
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
            data['length_unit'] = form.cleaned_data['length_unit']
            data['r0_unit'] = form.cleaned_data['r0_unit']
            data['ra_unit'] = form.cleaned_data['ra_unit']
            data['x_unit'] = form.cleaned_data['x_unit']
            data['force_unit'] = form.cleaned_data['force_unit']

            # convert to unit objects
            data['length'] = data['length'] * ureg(data['length_unit'])
            data['r0'] = data['r0'] * ureg(data['r0_unit'])
            data['ra'] = data['ra'] * ureg(data['ra_unit'])
            data['x'] = data['x'] * ureg(data['x_unit'])
            data['force'] = data['force'] * ureg(data['force_unit'])

            compute = data['compute']
            data[compute] = None

            if compute in ['length', 'r0', 'ra', 'x', 'force']:
                output_unit = data[compute + "_unit"]
            else:
                output_unit = None

            if data['xGraph'] in ['length', 'r0', 'ra', 'x', 'force']:
                idv_unit = data[data['xGraph'] + "_unit"]
            else:
                idv_unit = None

            if data['xGraph'] == 'voltage':
                x = 'Voltage'
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 0.0, 51.0,
                                           1.0):
                    labels.append(k)
                    graph.append(round(v, sig_figs))

            elif data['xGraph'] == 'length':
                x = 'Length (mm)'
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 5.0, 26.0,
                                           1.0):
                    labels.append(k)
                    graph.append(round(v, sig_figs))

            elif data['xGraph'] == 'r0':
                x = 'r0'
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 1.0, 5.0,
                                           0.1):
                    labels.append(round(k, sig_figs))
                    graph.append(v)

            elif data['xGraph'] == 'ra':
                x = 'ra'
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 1.0, 5.0,
                                           0.1):
                    labels.append(round(k, sig_figs))
                    graph.append(v)

            elif data['xGraph'] == 'x':
                x = 'x'
                length = float(data['length']) + 1.0
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 0.0, length,
                                           1.0):
                    labels.append(k)
                    graph.append(round(v, sig_figs))

            elif data['xGraph'] == 'awg':
                x = 'American Wire Gauge'
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 1.0, 5.0,
                                           0.1):
                    labels.append(k)
                    graph.append(round(v, sig_figs))

            elif data['xGraph'] == 'force':
                x = 'Force'
                for k, v in solenoid_range(data['voltage'], data['length'], data['r0'], data['ra'], data['awg'],
                                           data['x'], data['force'], output_unit, data['xGraph'], idv_unit, 1.0, 50.0,
                                           1.0):
                    labels.append(k)
                    graph.append(round(v, sig_figs))
    else:
        compute = "Unknown Value"

    return JsonResponse(data={
        'labels': labels,
        'data': graph,
        'x': x,
        'y': compute,
    })
