from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="searches")
    origin = models.CharField(max_length=10)
    destination = models.CharField(max_length=10)
    departure_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    trip_purpose = models.CharField(max_length=50, blank=True, null=True)
    search_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.origin} to {self.destination}"



class FlightPayment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    search_history = models.ForeignKey(SearchHistory, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=100, unique=True)
    payment_status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.payment_id} by {self.user.email}"