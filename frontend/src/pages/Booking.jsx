import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const Booking = ({ flightDetails }) => {
  const handleBooking = () => {
    // Implement booking logic here
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>Booking</Typography>
      {/* Render flight details */}
      <Button variant="contained" color="primary" onClick={handleBooking}>Book Flight</Button>
    </Container>
  );
};

export default Booking;
