import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { PersonStanding } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" className="bg-indigo-900">
      <Toolbar className="justify-between">
        {/* Brand Link */}
        <Link to="/" className="flex items-center space-x-2 text-white no-underline">
          <Typography variant="h6" className="font-bold">
            FlightWise
          </Typography>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link to="/flight/search" className="text-white no-underline">
            <Button color="inherit">Search Flights</Button>
          </Link>
          <Link to="/booking" className="text-white no-underline">
            <Button color="inherit">Book Now</Button>
          </Link>

          {/* User Section */}
          <div className="flex items-center space-x-2">
            <PersonStanding className="h-5 w-5" />
            <div>
              {user ? (
                <>
                  {/* Welcome Message */}
                  <Typography variant="body1" className="text-white">
                    Welcome, {user.name}
                  </Typography>
                  {/* Logout Button */}
                  <Button color="inherit" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {/* Login and Register Links */}
                  <Link to="/login" className="text-white no-underline">
                    <Button color="inherit">Login</Button>
                  </Link>
                  <Link to="/register" className="text-white no-underline">
                    <Button color="inherit">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
