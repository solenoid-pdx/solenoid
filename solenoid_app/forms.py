from django import forms

class DataSetForm(forms.Form):
    voltage = forms.FloatField()
    length = forms.FloatField()
    r_not = forms.FloatField()
    r_a = forms.FloatField()
    x = forms.FloatField()
    force = forms.FloatField()
    awg = forms.CharField()
    compute = forms.CharField()
    toGraph = forms.CharField()


class GraphSetForm(DataSetForm):
    toGraph = forms.CharField()