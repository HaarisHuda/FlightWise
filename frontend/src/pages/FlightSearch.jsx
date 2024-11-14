import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const FlightSearch = () => {
  const [searchData, setSearchData] = useState({ origin: '', destination: '', departureDate: '' });

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Handle search and display results
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>Search Flights</Typography>
      <form onSubmit={handleSearch}>
        <TextField label="Origin" name="origin" fullWidth margin="normal" value={searchData.origin} onChange={handleChange} />
        <TextField label="Destination" name="destination" fullWidth margin="normal" value={searchData.destination} onChange={handleChange} />
        <TextField label="Departure Date" name="departureDate" type="date" fullWidth margin="normal" value={searchData.departureDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Search</Button>
      </form>
    </Container>
  );
};

export default FlightSearch;
