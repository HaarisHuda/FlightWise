import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { Plane, Clock, CalendarDays, Luggage } from 'lucide-react';

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return {
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
};

const formatDuration = (duration) => {
  const matches = duration.match(/PT(\d+)H(\d+)M/);
  if (matches) {
    return `${matches[1]}h ${matches[2]}m`;
  }
  return duration;
};

const FlightSegment = ({ segment, isLastSegment }) => {
  const departure = formatDateTime(segment.departure.at);
  const arrival = formatDateTime(segment.arrival.at);

  return (
    <Box sx={{ mb: isLastSegment ? 0 : 4 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={4}>
          <Box>
            <Typography variant="h5" fontWeight="bold">{departure.time}</Typography>
            <Typography variant="body2" color="text.secondary">{departure.date}</Typography>
            <Typography variant="h6">{segment.departure.iataCode}</Typography>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} style={{ marginRight: 4 }} />
              {formatDuration(segment.duration)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <Divider sx={{ flex: 1 }} />
              <Plane style={{ margin: '0 8px', color: '#1976d2' }} size={20} />
              <Divider sx={{ flex: 1 }} />
            </Box>
            <Typography variant="body2">{segment.carrierCode}</Typography>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">{arrival.time}</Typography>
            <Typography variant="body2" color="text.secondary">{arrival.date}</Typography>
            <Typography variant="h6">{segment.arrival.iataCode}</Typography>
          </Box>
        </Grid>
      </Grid>

      {!isLastSegment && (
        <Box sx={{ my: 2 }}>
          <Divider />
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
            Connection
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const FlightItinerary = ({ itinerary, isReturn }) => (
  <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
    <Box sx={{ mb: 2 }}>
      <Chip 
        label={isReturn ? "Return Flight" : "Outbound Flight"}
        color={isReturn ? "secondary" : "primary"}
        size="small"
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarDays size={16} />
        <Typography variant="body2" color="text.secondary">
          {formatDateTime(itinerary.segments[0].departure.at).date}
        </Typography>
      </Box>
    </Box>

    {itinerary.segments.map((segment, idx) => (
      <FlightSegment
        key={idx}
        segment={segment}
        isLastSegment={idx === itinerary.segments.length - 1}
      />
    ))}
  </Paper>
);

const FlightResult = ({ flight }) => {
  const handleBooking = () => {
    console.log('Booking flight:', flight);
  };

  return (
    <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">€{flight.price.total}</Typography>
          <Typography variant="body2" color="text.secondary">per person</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Luggage size={16} />
            <Typography variant="body2" color="text.secondary">
              No checked bags included
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleBooking}
            sx={{ minWidth: 200 }}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      {flight.itineraries.map((itinerary, idx) => (
        <FlightItinerary
          key={idx}
          itinerary={itinerary}
          isReturn={idx === 1}
        />
      ))}
    </Paper>
  );
};

const FlightResults = () => {
  const location = useLocation();
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Retrieve flights data from local storage
    const storedFlights = localStorage.getItem('flights');
    if (storedFlights) {
    //   console.log('Retrieved flights data from localStorage:', storedFlights);
      setFlights(JSON.parse(storedFlights).flights);
    } else {
      console.warn('No flights data found in localStorage.');
    }
  }, []);
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Flight Results
      </Typography>
      {flights.map((flight, idx) => (
        <FlightResult key={idx} flight={flight} />
      ))}
    </Container>
  );
};

export default FlightResults;