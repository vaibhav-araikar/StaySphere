# StaySphere 🏡

### *A Full-Stack Hotel & Destination Booking Platform*

StaySphere is a full-stack Airbnb-inspired web application that enables users to discover, create, manage, and book accommodations seamlessly. Developed using the **MERN ecosystem with Node.js, Express.js, MongoDB, and EJS**, the application follows the **Model-View-Controller (MVC) architecture** to ensure scalability, maintainability, and clean code organization. It incorporates secure authentication and authorization mechanisms, robust CRUD functionality, and an intuitive user experience.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* User registration and login functionality.
* Secure password hashing using **bcrypt**.
* Session and JWT-based authentication.
* Role-based authorization and ownership verification.
* Protected routes to prevent unauthorized access.
* User session management and access control.

### 🏨 Property Listings Management

* Create, update, and delete property listings.
* Browse all available hotels and destinations.
* View detailed listing pages with descriptions and images.
* Search and explore accommodation options.
* Manage listings through authorized user access.

### ⭐ Reviews & Ratings

* Add and manage reviews for listings.
* Delete reviews with proper authorization.
* Star-based rating system for user feedback.

### 📅 Reservation Workflow

* Explore available stays and destinations.
* Simulated booking and reservation flow.
* View accommodation details before booking.

### 🗄️ Database Integration

MongoDB is used to efficiently manage and store:

* User information
* Property listings
* Reviews and ratings
* Booking-related data

### 🛡️ Security & Validation

* Authentication middleware implementation.
* Authorization checks for listing ownership.
* Input validation and sanitization.
* Centralized error handling.
* Secure environment variable management.
* Route protection against unauthorized access.

### 🎨 User Experience

* Responsive and Airbnb-inspired interface.
* Interactive frontend with JavaScript and EJS templates.
* Clean and user-friendly design.
* Dynamic rendering of content and pages.

---

# 🏗️ Architecture

The application follows the **Model-View-Controller (MVC) design pattern**, ensuring separation of concerns and improving code maintainability:

* **Models:** Define MongoDB schemas and database interactions.
* **Views:** Render dynamic user interfaces using EJS templates.
* **Controllers:** Handle business logic and request processing.
* **Routes:** Manage API endpoints and page navigation.
* **Middleware:** Implement authentication, authorization, and validation logic.
* **Utilities:** Centralized error handling and helper functions.

---

# ⚙️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* Passport.js
* Express Session
* JSON Web Tokens (JWT)
* bcrypt

### Cloud & Utilities

* Cloudinary
* Multer
* dotenv
* method-override
* Joi Validation
* express-validator

---

# 📂 Project Structure

```bash
StaySphere/
│
├── models/          # Database schemas
├── routes/          # Route definitions
├── controllers/     # Business logic
├── views/           # EJS templates
├── public/          # Static assets
├── middleware/      # Authentication & validation middleware
├── utils/           # Error handling and helper functions
├── app.js           # Main server file
├── package.json
└── README.md
```

---

# 🎯 Learning Outcomes

* Full-Stack Web Development using the MERN ecosystem.
* Implementation of the MVC architecture.
* Authentication and authorization mechanisms.
* RESTful API design and CRUD operations.
* MongoDB schema design and database integration.
* Session management and route protection.
* Input validation and centralized error handling.
* Building scalable and maintainable web applications.

---

## 👨‍💻 Author

**Vaibhav Araikar**

> *StaySphere delivers a secure and scalable hotel and destination booking experience by combining modern web technologies with the MVC architectural pattern, authentication, authorization, and efficient database management.*
