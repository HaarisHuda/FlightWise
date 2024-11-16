import React from 'react';
import { Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';

const destinations = [
  {
    city: 'Paris',
    country: 'France',
    image: 'https://media.timeout.com/images/106181719/1024/768/image.webp',
    price: '$299'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/288px-Skyscrapers_of_Shinjuku_2009_January.jpg',
    price: '$799'
  },
  {
    city: 'New York',
    country: 'USA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/432px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
    price: '$499'
  },
  {
    city: 'Dubai',
    country: 'UAE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Dubai_Skyline_mit_Burj_Khalifa_%28cropped%29.jpg/417px-Dubai_Skyline_mit_Burj_Khalifa_%28cropped%29.jpg',
    price: '$399'
  }
];

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-12">
        <img 
          src="bg_hero.jpg" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <Typography variant="h2" className="mb-4 font-bold">
              Discover Your Next Adventure
            </Typography>
            <Typography variant="h5" className="mb-6">
              Explore the world with our best flight deals
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              className="bg-indigo-600 hover:bg-indigo-700"
              endIcon={<ArrowRight />}
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <Typography variant="h4" className="mb-6 font-bold">
        Popular Destinations
      </Typography>
      <Grid container spacing={4}>
        {destinations.map((dest, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="h-full transform transition-transform hover:scale-105">
              <CardMedia
                component="img"
                height="200"
                image={dest.image}
                alt={dest.city}
                className="h-48"
              />
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  {dest.city}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  {dest.country}
                </Typography>
                <Typography variant="h6" color="primary" className="font-bold">
                  From {dest.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;