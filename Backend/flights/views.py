import os
from dotenv import load_dotenv
from amadeus import Client, ResponseError
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SearchHistory
from .serializers import SearchHistorySerializer
from .utils import Flight, get_airline_logo, get_hour, get_stoptime

# Load environment variables
load_dotenv()

# Retrieve Amadeus credentials
AMADEUS_API_KEY = os.getenv('AMADEUS_API_KEY')
AMADEUS_API_SECRET = os.getenv('AMADEUS_API_SECRET')
AMADEUS_API_ENV = os.getenv('AMADEUS_API_ENV', 'test') 
# Initialize Amadeus client
amadeus = Client(
    client_id=AMADEUS_API_KEY,
    client_secret=AMADEUS_API_SECRET,
    hostname='production' if AMADEUS_API_ENV == 'production' else 'test'
)

class FlightSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        origin = request.data.get("origin")
        destination = request.data.get("destination")
        departure_date = request.data.get("departureDate")[:10]
        return_date = request.data.get("returnDate")[:10]

        if not origin or not destination or not departure_date:
            return Response({"error": "Origin, destination, and departure date are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        kwargs = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "adults": 1,
        }

        trip_purpose = ""

        # Include return date if provided
        if return_date:
            kwargs["returnDate"] = return_date
            kwargs_trip_purpose = {
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": departure_date,
                "returnDate": return_date,
            }
            # Retrieve trip purpose using Amadeus API
            try:
                trip_purpose_response = amadeus.travel.predictions.trip_purpose.get(**kwargs_trip_purpose).data
                trip_purpose = trip_purpose_response.get("result", "Unknown")
            except ResponseError as error:
                return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)

        # Search for flight offers
        try:
            search_flights = amadeus.shopping.flight_offers_search.get(**kwargs).data
        except ResponseError as error:
            return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)

        # Save search to history
        search_entry = SearchHistory.objects.create(
            user=request.user,
            origin=origin,
            destination=destination,
            departure_date=departure_date,
            return_date=return_date,
            trip_purpose=trip_purpose
        )

        # Process and structure the flight offers for JSON response
        search_flights_returned = []
        for flight in search_flights:
            offer = Flight(flight).construct_flights()
            search_flights_returned.append(offer)

        return Response({
            "search_id": search_entry.id,
            "origin": origin,
            "destination": destination,
            "departureDate": departure_date,
            "returnDate": return_date,
            "tripPurpose": trip_purpose,
            "flights": search_flights_returned
        }, status=status.HTTP_200_OK)








import paypalrestsdk
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import FlightPayment, SearchHistory

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": "sandbox",  # Use "live" for production
    "client_id": os.getenv('PAYPAL_CLIENT_ID'),
    "client_secret": os.getenv('PAYPAL_CLIENT_SECRET')
})

class PayPalPaymentView(APIView):

    def post(self, request, search_id):
        user = request.user
        search_history = get_object_or_404(SearchHistory, id=search_id, user=user)
        amount = request.data.get("amount")  # Get the amount from the request

        # Create a new payment
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": str(amount),
                    "currency": "USD"
                },
                "description": f"Flight payment from {search_history.origin} to {search_history.destination}"
            }],
            "redirect_urls": {
                "return_url": "http://localhost:8000/flights/paypal/execute",  # URL to redirect after approval
                "cancel_url": "http://localhost:8000/flights/paypal/cancel"
            }
        })

        if payment.create():
            # Save the payment details in the database
            FlightPayment.objects.create(
                user=user,
                search_history=search_history,
                amount=amount,
                payment_id=payment.id,
                payment_status="CREATED"
            )
            # Return the approval URL to the frontend for redirection
            for link in payment.links:
                if link.rel == "approval_url":
                    return Response({"approval_url": link.href}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Error creating payment"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For executing the payment after approval
class PayPalExecutePaymentView(APIView):

    def post(self, request):
        payment_id = request.data.get("payment_id")
        payer_id = request.data.get("payer_id")

        # Get the payment object
        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({"payer_id": payer_id}):
            # Update the payment status to completed in the database
            flight_payment = FlightPayment.objects.get(payment_id=payment_id)
            flight_payment.payment_status = "COMPLETED"
            flight_payment.save()

            return Response({"message": "Payment successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Error executing payment"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
