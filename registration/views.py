from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import RegisterForm


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, ("Successfully signed up"))
            return redirect("/")
        else:
            for err, msg in form.error_messages.items():
                messages.success(request, f"{err}: {msg}")
    else:
        form = RegisterForm()

    return render(request, "registration/register.html", {"form": form})