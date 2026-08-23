Gym Booking API

A RESTful backend API for managing gym sessions, members, trainers, and bookings.

This project was developed as part of a backend training project, with a focus on building a structured API, working with a database, implementing authentication and authorization, and deploying a functional backend application.

Features

- User registration and login
- JWT-based authentication
- Role-based authorization for Members and Trainers
- Password hashing
- User profile management
- Gym session management
- Search and filtering for sessions
- Class booking and cancellation
- View personal bookings
- Dashboard statistics
- Request validation
- Centralized error handling
- Request logging
- Swagger API documentation
- MongoDB database integration
- Deployed backend

Tech Stack

- Node.js — Runtime environment
- TypeScript — Programming language
- Express.js — Backend framework
- MongoDB — Database
- Mongoose — MongoDB ODM
- JWT — Authentication
- bcryptjs — Password hashing
- express-validator — Request validation
- Swagger — API documentation
- dotenv — Environment configuration
- CORS — Cross-origin resource sharing

Project Structure

gym-booking-api/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── swagger.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── bookingController.ts
│   │   ├── dashboardController.ts
│   │   └── sessionController.ts
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── bookingValidation.ts
│   │   ├── errorMiddleware.ts
│   │   ├── loggerMiddleware.ts
│   │   └── sessionValidation.ts
│   │
│   ├── models/
│   │   ├── bookingModel.ts
│   │   ├── classSessionModel.ts
│   │   └── userModel.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── dashboardRouter.ts
│   │   └── sessionRoutes.ts
│   │
│   └── server.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

Architecture

The project follows a structured backend architecture:

- Routes — Define API endpoints and connect them to controllers.
- Controllers — Handle the main application logic.
- Models — Define MongoDB data models using Mongoose.
- Middlewares — Handle authentication, authorization, validation, logging, and errors.
- Config — Contains database and Swagger configuration.
- Server — Initializes the Express application, middleware, routes, Swagger, and database connection.

Authentication & Authorization

The API uses JSON Web Tokens (JWT) for authentication.

After logging in, the client receives a JWT token that can be sent using the "Authorization" header:

Authorization: Bearer <your-token>

The system supports two user roles:

- Member
- Trainer

Protected routes require authentication, while role-specific operations are restricted based on the user's role.

Main API Areas

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Users can register, log in, and retrieve their profile information.

Sessions

GET    /api/sessions
GET    /api/sessions/:id
POST   /api/sessions
PUT    /api/sessions/:id
DELETE /api/sessions/:id

Sessions can be created, updated, deleted, retrieved, and filtered based on available parameters.

Bookings

The booking system allows members to:

- Browse available sessions
- Book a session
- View their bookings
- Cancel a booking

The API also handles booking status and session capacity.

Dashboard

GET /api/dashboard

The dashboard provides statistics related to the gym system, including information about members, trainers, sessions, and bookings.

API Documentation

Interactive API documentation is available through Swagger UI.

After running the project locally, open:

http://localhost:3000/api-docs

Swagger allows you to explore and test the available API endpoints.

Getting Started

Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB
- Git

1. Clone the Repository

git clone https://github.com/kiro8121/gym-booking-api.git
cd gym-booking-api

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a ".env" file in the project root and add:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Do not commit your ".env" file or expose your database credentials or JWT secret.

4. Run the Development Server

npm run dev

The API will be available at:

http://localhost:3000

5. Build the Project

npm run build

6. Start the Production Build

npm start

Deployment

The backend is deployed using Railway.

Live API:
https://gym-booking-api-production.up.railway.app/

Swagger Documentation:
https://gym-booking-api-production.up.railway.app/api-docs

Learning Outcomes

Through this project, we gained practical experience with:

- Building RESTful APIs
- TypeScript backend development
- MongoDB and Mongoose
- JWT authentication
- Role-based access control
- Password hashing
- Middleware design
- Request validation
- Error handling
- API documentation with Swagger
- Git and GitHub collaboration
- Backend deployment

Project

This project was developed as a team project during backend training.

The repository focuses on the backend implementation and API functionality.
