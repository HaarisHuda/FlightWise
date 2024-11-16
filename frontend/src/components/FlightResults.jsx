import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Divider 
} from '@mui/material';
import { Plane, Clock, DollarSign } from 'lucide-react';

const FlightResults = ({ flights }) => {
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      {flights?.map((flight, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              {/* Airline Info */}
              <div className="flex items-center space-x-4">
                <img 
                  src={flight.airlineLogo || '/api/placeholder/50/50'} 
                  alt={flight.airline}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <Typography variant="h6">{flight.airline}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Flight {flight.flightNumber}
                  </Typography>
                </div>
              </div>

              {/* Flight Times */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <Typography variant="h6">{formatTime(flight.departureTime)}</Typography>
                  <Typography variant="body2">{flight.origin}</Typography>
                </div>
                
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <Typography variant="body2">
                    {formatDuration(flight.duration)}
                  </Typography>
                  <div className="relative w-32">
                    <Divider />
                    <Plane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 rotate-90 h-4 w-4 text-indigo-600" />
                  </div>
                  <Typography variant="body2" color="text.secondary">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </Typography>
                </div>

                <div className="text-center">
                  <Typography variant="h6">{formatTime(flight.arrivalTime)}</Typography>
                  <Typography variant="body2">{flight.destination}</Typography>
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <Typography variant="h5" color="primary" className="flex items-center">
                    <DollarSign className="h-5 w-5" />
                    {flight.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per person
                  </Typography>
                </div>
                <Button 
                  variant="contained" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Select Flight
                </Button>
              </div>
            </div>

            {/* Flight Details */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <Chip 
                  label={`${flight.cabinClass} Class`} 
                  size="small" 
                  className="bg-gray-100"
                />
                <Chip 
                  label={`${flight.seatsAvailable} seats left`} 
                  size="small" 
                  className="bg-gray-100"
                />
                {flight.features?.map((feature, idx) => (
                  <Chip 
                    key={idx} 
                    label={feature} 
                    size="small" 
                    className="bg-gray-100"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;