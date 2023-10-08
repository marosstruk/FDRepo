import json

from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class FinancialStatement(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    year = models.IntegerField()
    text = models.CharField(max_length=1000000)

    def __str__(self):
        return self.text


class PdfDoc:
    def __init__(self, filename, file):
        self.Filename = filename
        self.File = file

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)