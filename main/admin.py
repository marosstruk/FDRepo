from django.contrib import admin
from .models import Company, FinancialStatement

# Register your models here.
admin.site.register(Company)
admin.site.register(FinancialStatement)