import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';

const FlightPricePredictor = () => {
  const [formData, setFormData] = useState({
    airline: '',
    source_city: '',
    departure_time: '',
    stops: '',
    arrival_time: '',
    destination_city: '',
    class: '',
    duration: '',
    days_left: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const airlines = [
    'American Airlines', 'United Airlines', 'Delta Air Lines', 'Southwest Airlines', 'JetBlue'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
    'Philadelphia', 'San Antonio', 'San Diego'
  ];

  const flightClasses = ['Economy', 'Business'];

  const timeSlots = [
    'Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night', 'Late Night'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/flights/api/predict-flight-price/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Prediction failed');
      }

      // Convert INR to USD (INR * (1/80) * 3.5)
      const usdPrice = (data.predicted_price / 80) * 3.5;
      setResult(usdPrice);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom component="h1" align="center">
          US Flight Price Predictor
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="airline"
                label="Airline"
                value={formData.airline}
                onChange={handleChange}
                required
              >
                {airlines.map(airline => (
                  <MenuItem key={airline} value={airline}>
                    {airline}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="source_city"
                label="Source City"
                value={formData.source_city}
                onChange={handleChange}
                required
              >
                {cities.map(city => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="destination_city"
                label="Destination City"
                value={formData.destination_city}
                onChange={handleChange}
                required
              >
                {cities.map(city => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="class"
                label="Class"
                value={formData.class}
                onChange={handleChange}
                required
              >
                {flightClasses.map(cls => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="departure_time"
                label="Departure Time"
                value={formData.departure_time}
                onChange={handleChange}
                required
              >
                {timeSlots.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="arrival_time"
                label="Arrival Time"
                value={formData.arrival_time}
                onChange={handleChange}
                required
              >
                {timeSlots.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="stops"
                label="Number of Stops"
                value={formData.stops}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="duration"
                label="Duration (hours)"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="days_left"
                label="Days Left"
                value={formData.days_left}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Predict Price'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result !== null && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h5" component="div" gutterBottom>
                Predicted Price: ${result.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FlightPricePredictor;