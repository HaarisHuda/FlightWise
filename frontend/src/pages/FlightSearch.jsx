import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, Plane, Calendar } from 'lucide-react';

const FlightSearch = () => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/flights/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(searchData)
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error searching flights:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center text-gray-800">
            <Plane className="mr-2" />
            Search Flights
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter city or airport"
                  value={searchData.origin}
                  onChange={(e) => setSearchData({...searchData, origin: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter city or airport"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                <div className="relative">
                  <DatePicker
                    selected={searchData.departureDate}
                    onChange={(date) => setSearchData({...searchData, departureDate: date})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    dateFormat="MMM dd, yyyy"
                    minDate={new Date()}
                    placeholderText="Select departure date"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <div className="relative">
                  <DatePicker
                    selected={searchData.returnDate}
                    onChange={(date) => setSearchData({...searchData, returnDate: date})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    dateFormat="MMM dd, yyyy"
                    minDate={searchData.departureDate || new Date()}
                    placeholderText="Select return date"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <Search size={20} />
              <span>Search Flights</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;