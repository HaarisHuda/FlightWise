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

load_dotenv()

# Retrieve variables from the environment
AMADEUS_API_KEY = os.getenv('AMADEUS_API_KEY')
AMADEUS_API_SECRET = os.getenv('AMADEUS_API_SECRET')
AMADEUS_API_ENV = os.getenv('AMADEUS_API_ENV', 'test')  # default to 'test'

# Initialize Amadeus Client
amadeus = Client(
    client_id=AMADEUS_API_KEY,
    client_secret=AMADEUS_API_SECRET,
)

class FlightSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        origin = request.data.get("origin")
        destination = request.data.get("destination")
        departure_date = request.data.get("departure_date")
        return_date = request.data.get("return_date")
        trip_purpose = ""

        kwargs = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "adults": 1,
        }
        if return_date:
            kwargs["returnDate"] = return_date
            try:
                trip_purpose_response = amadeus.travel.predictions.trip_purpose.get(
                    originLocationCode=origin,
                    destinationLocationCode=destination,
                    departureDate=departure_date,
                    returnDate=return_date
                ).data
                trip_purpose = trip_purpose_response["result"]
            except ResponseError as error:
                return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)

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
        
        response_data = {
            "trip_purpose": trip_purpose,
            "flights": search_flights
        }
        return Response(response_data, status=status.HTTP_200_OK)
