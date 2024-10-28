import requests
from datetime import datetime, timedelta

class Flight:
    def __init__(self, flight_data):
        self.flight_data = flight_data

    def construct_flights(self):
        """Structure flight data for a JSON-friendly response."""
        itinerary_data = []

        for itinerary in self.flight_data.get("itineraries", []):
            segments = []
            for segment in itinerary.get("segments", []):
                segments.append({
                    "departure": {
                        "iataCode": segment["departure"].get("iataCode"),
                        "at": segment["departure"].get("at")
                    },
                    "arrival": {
                        "iataCode": segment["arrival"].get("iataCode"),
                        "at": segment["arrival"].get("at")
                    },
                    "carrierCode": segment.get("carrierCode"),
                    "aircraft": segment["aircraft"].get("code"),
                    "duration": segment.get("duration"),
                    "airlineLogo": get_airline_logo(segment.get("carrierCode")),
                })
            itinerary_data.append({
                "duration": itinerary.get("duration"),
                "segments": segments
            })

        price_data = self.flight_data.get("price", {})
        traveler_pricing_data = self.flight_data.get("travelerPricings", [])

        return {
            "source": self.flight_data.get("source"),
            "price": {
                "currency": price_data.get("currency"),
                "total": price_data.get("total"),
                "base": price_data.get("base")
            },
            "itineraries": itinerary_data,
            "travelerPricings": [
                {
                    "travelerType": pricing.get("travelerType"),
                    "fareDetailsBySegment": pricing.get("fareDetailsBySegment")
                }
                for pricing in traveler_pricing_data
            ]
        }

def get_airline_logo(carrier_code):
    """Fetch the logo URL for a given airline carrier code."""
    if not carrier_code:
        return None
    return f"https://airline-logos-url.com/{carrier_code}.png"

def get_hour(date_time_str):
    """Extract the hour from a datetime string."""
    try:
        dt = datetime.fromisoformat(date_time_str)
        return dt.strftime('%H:%M')
    except ValueError:
        return None

def get_stoptime(duration_str):
    """Convert flight duration from ISO 8601 format to hours and minutes."""
    try:
        duration = duration_str.replace("PT", "")
        hours, minutes = 0, 0
        if "H" in duration:
            hours, remainder = duration.split("H")
            hours = int(hours)
            duration = remainder
        if "M" in duration:
            minutes = int(duration.replace("M", ""))
        return f"{hours}h {minutes}m"
    except Exception:
        return "Invalid format"
