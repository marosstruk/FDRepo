from django import forms


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class CreateNewCompany(forms.Form):
    name = forms.CharField(label="Name", max_length=200)
    check = forms.BooleanField(required=False)


class UploadNewFile(forms.Form):
    file = forms.FileField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = "drop-zone__input"
            visible.field.widget.attrs['id'] = "upload-form__input"
            visible.field.widget.attrs['multiple'] = True
            visible.label = None
