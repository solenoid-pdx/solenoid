from django import forms

class DataSetForm(forms.Form):
    V = forms.DecimalField()
    L = forms.DecimalField()
    N = forms.DecimalField()
    ALPHA = forms.DecimalField()
    GAMMA = forms.DecimalField()
    R0 = forms.DecimalField()
    Ra = forms.DecimalField()
    X = forms.DecimalField()
    F = forms.DecimalField()