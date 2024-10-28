from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-create'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path("user-details/",UserProfileDetail.as_view(), name="userdetails") 
]