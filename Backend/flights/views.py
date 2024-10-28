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
        departure_date = request.data.get("departure_date")
        return_date = request.data.get("return_date")

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
