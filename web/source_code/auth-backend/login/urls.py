from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('', views.CheckUser),
    path('authenticate', views.PwdAuthenticate),
    path('send', views.SendAddressVerification),
    path('verify', views.VerifyAddress),
    # path('create', views.CreateUser),
    path('register', views.Register),
    path('add-address', views.AddAddress),
    path('retrieve-username', views.RetrieveUsername),
    path('reset-password', views.ResetPassword),
    path('logout', views.SignOut),
    path('post-image', views.PostImage),
    path('change-password', views.ChangePassword),
    path('delete-profile', views.DeleteProfile)
]
