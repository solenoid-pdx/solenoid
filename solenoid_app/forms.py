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
    relative_permeability = forms.FloatField()
    length_unit = forms.CharField()
    r0_unit = forms.CharField()
    ra_unit = forms.CharField()
    x_unit = forms.CharField()
    force_unit = forms.CharField()


class GraphForm(DataSetForm):
    xGraph = forms.CharField()
