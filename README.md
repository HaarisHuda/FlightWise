FlightWise

1. User Management
    • Task 1: User Registration and Authentication
        ◦ Users need to register with their email, username, and password.
        ◦ After registration, a JWT token will be issued to authenticate future requests.
        ◦ Users can log in and out of their accounts using valid credentials.
        ◦ A profile management system allows users to update their preferences.
Endpoints:
        ◦ POST /register: Register a new user.
        ◦ POST /login: Authenticate user credentials and return JWT token.
        ◦ POST /logout: Log the user out of the system.
        ◦ GET /profile: Fetch the user's profile data (authentication required).
        ◦ PUT /profile/data: Update user preferences in their profile.
Models:
        ◦ User: Stores user data such as name, email, password, etc.
        ◦ User Preferences: Manages preferences set by users for the recommender system.

2. Flight Search
    • Task 2: Search Flights
        ◦ Users can search for flights based on origin, destination, travel dates, budget, and layover preferences.
        ◦ The system will return a list of available flights matching the search criteria.
        ◦ Search history is stored to provide users with quick access to previous searches.
Endpoints:
        ◦ POST /search: Accepts flight search parameters and queries a third-party API to fetch results.
Models:
        ◦ Flight: Stores information about available flights.
        ◦ Search History: Logs each search made by the user.

3. AI/ML Prediction
    • Task 3: Flight Price Prediction
        ◦ Users receive predictions on the best time to book flights to get the lowest prices.
        ◦ The system analyzes historical price data and provides price trend insights.
        ◦ Users will be notified when flight prices drop or when it's an optimal time to book based on the system’s analysis.
Endpoints:
        ◦ POST /set/prediction/:route_id: Predict flight prices based on the selected route.
Models:
        ◦ Price Prediction Model: Predicts optimal booking times based on historical data.
        ◦ Price History: Stores historical flight price data for analysis.

4. Route Optimization
    • Task 4: Optimize Flight Routes
        ◦ The system optimizes flight routes based on user preferences (e.g., shortest duration, least layovers).
        ◦ Implements algorithms like A* or Dijkstra’s to find the most efficient routes.
Models:
        ◦ Flight Route: Stores various flight routes available for optimization.
        ◦ Route Optimization Model: Applies optimization algorithms to suggest the best routes.

5. Booking Management
    • Task 5: Manage Flight Bookings
        ◦ Users can book flights through the system, leveraging third-party APIs for payment and booking details.
        ◦ Transaction details are stored for future reference.
Models:
        ◦ Booking: Stores all transaction details related to flight bookings.

6. VISA and Travel Information
    • Task 6: VISA and Travel Info Services
        ◦ The system provides users with relevant VISA and travel information based on their destination.
        ◦ Leverages third-party APIs to fetch and display up-to-date travel requirements for the user’s selected destinations.

Overview
The Flight Planner platform enables users to:
    • Search for flights based on their preferences.
    • Receive AI-powered price predictions to book flights at the lowest rates.
    • Optimize routes according to personal preferences.
    • Manage their bookings and get updated travel info for seamless planning.
Database Schema (PostgreSQL)
Tables:
    1. Users
        ◦ id: Unique identifier for each user.
        ◦ email: User’s email.
        ◦ username: Username for login.
        ◦ password: Hashed password.
        ◦ preferences: Stores user preferences for flight recommendations.
    2. Flights
        ◦ id: Unique identifier for each flight.
        ◦ origin: Departure location.
        ◦ destination: Arrival location.
        ◦ price: Ticket price.
        ◦ available_dates: List of available travel dates.
        ◦ layovers: Number of layovers.
    3. Search History
        ◦ id: Unique identifier for each search.
        ◦ user_id: Reference to the user's ID.
        ◦ search_params: Search criteria (origin, destination, dates, etc.).
        ◦ timestamp: Date and time of the search.
    4. Price History
        ◦ id: Unique identifier for price entries.
        ◦ flight_id: Reference to the flight ID.
        ◦ date: Date of price entry.
        ◦ price: Historical price for that flight.
    5. Bookings
        ◦ id: Unique identifier for each booking.
        ◦ user_id: Reference to the user’s ID.
        ◦ flight_id: Reference to the flight booked.
        ◦ transaction_details: Information about the payment transaction.

Backend API (Django + PostgreSQL)
Key Endpoints:
    1. User Management
        ◦ POST /register: Register a new user.
        ◦ POST /login: Login and authenticate a user.
        ◦ POST /logout: Log the user out.
        ◦ GET /profile: Retrieve user profile data.
        ◦ PUT /profile/data: Update user profile information.
    2. Flight Search
        ◦ POST /search: Search for available flights based on user-provided criteria.
    3. AI/ML Prediction
        ◦ POST /set/prediction/:route_id: Predict the best time to book flights for a particular route.
    4. Booking Management
        ◦ POST /booking: Book a flight and process payment.
    5. VISA and Travel Info
        ◦ GET /travel-info/:destination: Retrieve VISA and travel information for a specified destination.

Frontend UI/UX (React & React Native)
Components:
    1. User Dashboard
        ◦ Displays user preferences, recent searches, and booking history.
    2. Flight Search
        ◦ Search form for entering flight criteria.
        ◦ Displays search results, allowing users to filter by price, duration, and layovers.
    3. Price Prediction
        ◦ Display predicted price trends for flights.
        ◦ Show notifications of price drops or optimal booking times.
    4. Booking Management
        ◦ Overview of current and past bookings.
        ◦ Transaction details for each booking.
State Management:
    • React Context API or Redux for managing global state such as user data, flight searches, and bookings.
    • React Query for data fetching and synchronization with the backend.

Payment and Travel Integration
Payment Gateways:
    • Integration with third-party payment gateways like Stripe, Razorpay, or PayPal to handle booking transactions.
Logistics and VISA Integration:
    • APIs will be used to fetch and update information regarding travel documentation and VISA requirements for the user’s destination.
