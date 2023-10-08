from django.urls import path

from . import views

urlpatterns = [
    path("<int:id>", views.company, name="company"),
    path("", views.home, name="home"),
    path("create/", views.create, name="create"),
    path("uploadPdf/", views.uploadPdf, name="uploadPdf"),
    path("showPdf/", views.showPdf, name="showPdf"),
    path("companiesList/", views.companiesList, name="companiesList"),
    path("dataList/", views.dataList, name="dataList"),
    path("data/<str:id>", views.dataItem, name="dataItem"),
    path("data/<str:id>/download/<str:ext>", views.download, name="downloadFile"),
]