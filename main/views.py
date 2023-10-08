from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from utils import get_default_db_handle
from .handlers import DatabaseHandler, FileUploadHandler, FileDownloadHandler, DataHandler
from .models import Company, FinancialStatement, PdfDoc
from .forms import CreateNewCompany, UploadNewFile

from threading import Thread

import requests
import base64
import json
import mimetypes


dbHandler = DatabaseHandler()
downloadHandler = FileDownloadHandler(dbHandler)


def company(response, id):
    c = Company.objects.get(id=id)

    if response.method == "POST":
        print(response.POST)
        if response.POST.get("save"):
            for fc in c.financialstatement_set.all():
                if response.POST.get("c" + str(fc.id) == "clicked"):
                    fc.text = "OLD - " + fc.text
                else:
                    fc.text = "NEW - " + fc.text
                fc.save()
        elif response.POST.get("addNewFC"):
            txt = response.POST.get("newFC")
            if len(txt) > 2:
                c.financialstatement_set.create(text=txt, year=2000)
            else:
                print("invalid")

    return render(response, "main/company.html", {"c":c})


def home(response):
    if response.method == "POST":
        form = UploadNewFile(response.POST, response.FILES)
        if form.is_valid():
            f = response.FILES.getlist("file")
            f_id = FileUploadHandler.processFiles(f)[0]
            return HttpResponseRedirect("/data/%s" % f_id)
    else:
        form = UploadNewFile()
        
    return render(response, "main/home.html", {"narrow_navbar": True, "form": form})


def create(response):
    if response.method == "POST":
        form = CreateNewCompany(response.POST)
        if form.is_valid():
            n = form.cleaned_data["name"]
            c = Company(name=n)
            c.save()
            return HttpResponseRedirect("/%i" % c.id)
    else:
        form = CreateNewCompany()

    return render(response, "main/create.html", {"form": form})


def uploadPdf(response):
    if response.method == "POST":
        form = UploadNewFile(response.POST, response.FILES)
        if form.is_valid():
            f = response.FILES.getlist("file")
            f_id = FileUploadHandler.processFiles(f)[0]
            return HttpResponseRedirect("/data/%s" % f_id)
    else:
        form = UploadNewFile()

    return render(response, "main/uploadPdf.html", {"form": form})


def showPdf(response):
    return render(response, "main/showPdf.html", {"base64_file": None})


def companiesList(response):
    return render(response, "main/companiesList.html")


def dataList(response):
    data = dbHandler.get_many()
    formattedData = DataHandler.formatDataList(data)
    return render(response, "main/dataList.html", {"data": formattedData})


def dataItem(response, id):
    d = dbHandler.get_one(id)
    file = d["File"]
    pages = DataHandler.parsePages(d["Data"]["Pages"])
    data = DataHandler.parseStructuredData(d["Data"]["StructuredData"])
    
    # Initialize AI assistant for the current document (we don't care about the response)
    def init():
        try:
            requests.get("http://127.0.0.1:5000/api/beta/init", {"id": id})
        except:
            print("ERROR: AI Assistant failed to initialize")

    Thread(target=init).start()
    
    return render(response, "main/dataItem.html", {"base64_file": file, "pages": pages, "data": data})


def download(request, id, ext):
    filename = f"{id}.{ext}"
    file = None
    mime_type = ""
    
    match ext:
        case "txt":
            file = downloadHandler.asTxt(id)
            mime_type = "text/plain"
        case "csv":
            file = downloadHandler.asCsv(id)
            mime_type = "text/csv"
        case "xlsx":
            file = downloadHandler.asXlsx(id)
            mime_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        case "json":
            file = downloadHandler.asJson(id)
            mime_type = "application/json"
        case "xml":
            file = downloadHandler.asXml(id)
            mime_type = "application/xml"
        case _:
            pass

    response = HttpResponse(file.read(), content_type=mime_type)
    response["Content-Disposition"] = f"attachment; filename={filename}"
    return response