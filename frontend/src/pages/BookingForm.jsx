import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select 
} from '@mui/material';
import { PlaneTakeoff, Users, CreditCard } from 'lucide-react';

const BookingForm = () => {
  const [bookingData, setBookingData] = useState({
    passengerCount: 1,
    passengers: [{
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }],
    paymentMethod: 'credit_card'
  });

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...bookingData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setBookingData({ ...bookingData, passengers: newPassengers });
  };

  const handlePassengerCountChange = (event) => {
    const count = event.target.value;
    const passengers = [...bookingData.passengers];
    
    while (passengers.length < count) {
      passengers.push({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
    }
    
    setBookingData({
      ...bookingData,
      passengerCount: count,
      passengers: passengers.slice(0, count)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking data:', bookingData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <Typography variant="h4" className="mb-6 text-center font-bold flex items-center justify-center">
            <PlaneTakeoff className="mr-2" />
            Flight Booking
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Passenger Count Selection */}
            <FormControl fullWidth>
              <InputLabel>Number of Passengers</InputLabel>
              <Select
                value={bookingData.passengerCount}
                onChange={handlePassengerCountChange}
                label="Number of Passengers"
                startAdornment={<Users className="mr-2 h-5 w-5" />}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <MenuItem key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Passenger Details */}
            {bookingData.passengers.map((passenger, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <Typography variant="h6" className="mb-4">
                  Passenger {index + 1}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Title</InputLabel>
                      <Select
                        value={passenger.title}
                        onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                        label="Title"
                      >
                        <MenuItem value="Mr">Mr</MenuItem>
                        <MenuItem value="Mrs">Mrs</MenuItem>
                        <MenuItem value="Ms">Ms</MenuItem>
                        <MenuItem value="Dr">Dr</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4.5}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4.5}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={passenger.lastName}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={passenger.phone}
                      onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}

            {/* Payment Method */}
            <Card className="p-4 bg-gray-50">
              <Typography variant="h6" className="mb-4 flex items-center">
                <CreditCard className="mr-2" />
                Payment Method
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={bookingData.paymentMethod}
                  onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>
            </Card>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Proceed to Payment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;