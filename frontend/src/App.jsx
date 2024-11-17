import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingForm from './pages/BookingForm';
import { AuthProvider } from './context/AuthContext';
import PayPalComponent from './components/PayPalComponent';
import FlightResults from './components/FlightResults';
import FlightPricePredictor from './components/FlightPricePredictor';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#0277bd',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flight/search" element={<FlightSearch />} />
              <Route path="/flights/results" element={<FlightResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking" element={<BookingForm />} />
              <Route path="/paypal" element={<PayPalComponent />} />
              <Route path="/predict" element={<FlightPricePredictor />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;