from django.shortcuts import render, redirect
from .forms import RegisterForm


def register(request):

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("login")

    else:
        form = RegisterForm()

    return render(request, "accounts/register.html", {"form": form})


def user_login(request):
    return render(request, "accounts/login.html")


def user_logout(request):
    return render(request, "accounts/logout.html")