# flights/urls.py
from django.urls import path
from .views import FlightSearchView
from .views import PayPalPaymentView, PayPalExecutePaymentView

urlpatterns = [
    path('search/', FlightSearchView.as_view(), name='flight_search'),
    path('paypal/payment/<int:search_id>/', PayPalPaymentView.as_view(), name='paypal-payment'),
    path('paypal/execute/', PayPalExecutePaymentView.as_view(), name='paypal-execute-payment'),
]
