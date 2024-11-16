import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { Search, Plane, Calendar } from 'lucide-react';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Search initiated with data:', searchData);

    try {
      const response = await fetch('http://localhost:8000/flights/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      console.log('Search results:', data);

      // Store flight data in local storage
      localStorage.setItem('flights', JSON.stringify(data));

      // Navigate to results page
      navigate('/flights/results');
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <Plane sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1">
            Search Flights
          </Typography>
        </Box>

        <form onSubmit={handleSearch}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From"
                placeholder="Enter city or airport"
                value={searchData.origin}
                onChange={(e) =>
                  setSearchData({ ...searchData, origin: e.target.value })
                }
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="To"
                placeholder="Enter city or airport"
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData({ ...searchData, destination: e.target.value })
                }
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box position="relative">
                <DatePicker
                  selected={searchData.departureDate}
                  onChange={(date) =>
                    setSearchData({ ...searchData, departureDate: date })
                  }
                  customInput={
                    <TextField
                      fullWidth
                      label="Departure Date"
                      variant="outlined"
                    />
                  }
                  dateFormat="MMM dd, yyyy"
                  minDate={new Date()}
                  placeholderText="Select departure date"
                />
                <Calendar
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '14px',
                    pointerEvents: 'none',
                    color: '#666',
                  }}
                  size={20}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box position="relative">
                <DatePicker
                  selected={searchData.returnDate}
                  onChange={(date) =>
                    setSearchData({ ...searchData, returnDate: date })
                  }
                  customInput={
                    <TextField
                      fullWidth
                      label="Return Date"
                      variant="outlined"
                    />
                  }
                  dateFormat="MMM dd, yyyy"
                  minDate={searchData.departureDate || new Date()}
                  placeholderText="Select return date"
                />
                <Calendar
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '14px',
                    pointerEvents: 'none',
                    color: '#666',
                  }}
                  size={20}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Search />}
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Search Flights'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FlightSearch;
