from django import forms

class DataSetForm(forms.Form):
    voltage = forms.FloatField()
    length = forms.FloatField()
    r0 = forms.FloatField()
    ra = forms.FloatField()
    x = forms.FloatField()
    force = forms.FloatField()
    awg = forms.CharField()
    compute = forms.CharField()


class GraphForm(DataSetForm):
    xGraph = forms.CharField()