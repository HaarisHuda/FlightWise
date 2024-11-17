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

import joblib
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import pandas as pd
import numpy as np
import os 

# Load the model and its components
model_elements = joblib.load(os.path.join(os.path.dirname(__file__), 'Flight_ticket_model_gpu.joblib'))

@api_view(['POST'])
def predict_flight_price(request):
    try:
        # Get the input columns from model_elements
        inputs_cols = model_elements['input_cols']
        
        # First, create a dictionary with explicit type conversion
        input_data = {
            # Categorical columns - keep as strings
            'airline': str(request.data.get('airline', '')),
            'source_city': str(request.data.get('source_city', '')),
            'departure_time': str(request.data.get('departure_time', '')),
            'arrival_time': str(request.data.get('arrival_time', '')),
            'destination_city': str(request.data.get('destination_city', '')),
            'class': str(request.data.get('class', '')),
            
            # Numeric columns - convert to float32
            'stops': np.float32(request.data.get('stops', 0)),
            'duration': np.float32(request.data.get('duration', 0)),
            'days_left': np.float32(request.data.get('days_left', 0))
        }

        # Create DataFrame with correct column order
        input_df = pd.DataFrame([input_data], columns=inputs_cols)

        # Get numeric and categorical columns from model_elements
        numeric_cols = model_elements['numeric_cols']
        categorical_cols = model_elements['categorical_cols']

        # Ensure numeric columns are float32
        for col in numeric_cols:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce').astype(np.float32)

        # Ensure categorical columns are string
        for col in categorical_cols:
            input_df[col] = input_df[col].astype(str)

        # Print debug information
        print("Input DataFrame Types:")
        print(input_df.dtypes)
        print("Input DataFrame Columns:", input_df.columns.tolist())

        # Scale numeric features
        scaled_numeric = model_elements['scaler'].transform(input_df[numeric_cols].astype(np.float32))
        input_df[numeric_cols] = scaled_numeric

        # Encode categorical features
        encoded_cats = model_elements['encoder'].transform(input_df[categorical_cols])
        encoded_df = pd.DataFrame(
            encoded_cats,
            columns=model_elements['encoded_cols']
        )

        # Print debug information
        print("Encoded DataFrame Columns:", encoded_df.columns.tolist())

        # Combine features in the correct order
        feature_cols = numeric_cols + model_elements['encoded_cols'].tolist()
        X = pd.concat([
            input_df[numeric_cols],
            encoded_df
        ], axis=1)
        
        # Ensure column order matches training data
        X = X[feature_cols]

        # Convert to numpy array with explicit dtype
        X_array = X.astype(np.float32).to_numpy()

        # Print debug information
        print("Final array shape:", X_array.shape)
        print("Final array dtype:", X_array.dtype)
        print("Final feature names:", X.columns.tolist())

        # Convert GPU model to CPU if necessary
        if hasattr(model_elements['model'], 'to_cpu'):
            model = model_elements['model'].to_cpu()
        else:
            model = model_elements['model']

        # Make prediction
        prediction = float(model.predict(X_array)[0])

        return Response({
            'status': 'success',
            'predicted_price': round(prediction, 2),
            'input_processed': {
                'numeric': input_df[numeric_cols].to_dict(orient='records')[0],
                'categorical': input_df[categorical_cols].to_dict(orient='records')[0]
            }
        })

    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print("Error occurred:")
        print(error_traceback)
        
        return Response({
            'status': 'error',
            'message': str(e),
            'type': str(type(e)),
            'traceback': error_traceback
        }, status=400)