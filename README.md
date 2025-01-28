# TradeMyBook Backend

TradeMyBook is a book exchange platform built with a modular and scalable backend. The backend is designed to efficiently handle user registrations, book exchanges, comments, ratings, and other essential functionalities. It uses Node.js and PostgreSQL as the primary technologies.

## Architecture

The architecture of the TradeMyBook backend is based on a modular approach where functionalities are divided into distinct controllers and models. This provides easy maintenance, scalability, and efficient code management. The main file `index.js` initializes key functionalities like server management, database connections, and the routing of API requests.

The backend is organized into various parts, such as:

- **Controllers**: Handle the logic for different entities like users, books, comments, and trades.
- **Models**: Define the structure for interacting with the database using PostgreSQL.
- **Routes**: Define the endpoints for API communication between the client and server.
- **Middleware**: Includes authentication and other request validation.

## Key Features

- **User Management**: Handles user registration, login, and profile management using JWT-based authentication.
- **Book Management**: Allows users to add, search, and manage books, including filtering by location, author, and availability for exchange.
- **Comment System**: Enables users to comment on books and exchanges.
- **Trading System**: Facilitates the exchange of books, with the ability to create and manage trade requests, and view trade history.
- **Rating System**: Users can rate exchanges, providing a reputation system to build trust.
- **Email Notifications**: Automatic email notifications for user registration, trade requests, and updates using Nodemailer.
- **Security**: Ensures secure authentication with JWT tokens, input validation, and protection from common attacks like brute-force attempts.

## Technologies

- **Node.js**: A JavaScript runtime used for building the server.
- **Express**: Web framework for handling API requests.
- **PostgreSQL**: Relational database for storing user, book, and trade data.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.
- **Nodemailer**: For sending email notifications.
- **pg**: PostgreSQL client for Node.js.

## API Routes

### Authentication

- `POST /api/register`: Register a new user
- `POST /api/login`: Login a user
- `GET /api/confirm/:token`: Confirm user email with the provided token
- `POST /api/resend-email`: Resend email confirmation link

### Books

- `GET /api/books/search`: Search books (auth optional)
- `POST /api/books`: Add a new book (auth required)
- `GET /api/books/location/:location_id`: Get books by location (auth required)
- `GET /api/books/user`: Get books by the current user (auth required)
- `GET /api/books/:book_id`: Get details of a specific book by ID (auth required)
- `DELETE /api/books/:book_id`: Remove a book by ID (auth required)
- `PATCH /api/books/tradable/:book_id/:tradable`: Toggle the tradability status of a book (auth required)
- `PATCH /api/books/:book_id`: Update book details by ID (auth required)

### Users

- `GET /api/user`: Get current user's data (auth required)
- `GET /api/user/email/:email`: Get user data by email (auth required)
- `GET /api/user/id/:id`: Get user data by user ID (auth required)
- `GET /api/user/trades/accepted/:id`: Get accepted trade IDs by user ID (auth required)
- `PATCH /api/user/location`: Update user's location (auth required)
- `PATCH /api/user/name`: Update user's name (auth required)
- `PATCH /api/user/phone`: Update user's phone number (auth required)

### Locations

- `POST /api/location`: Add a new location (auth required)
- `GET /api/location/:id`: Get location by ID (auth required)
- `GET /api/location`: Get location by address (auth required)

### Trades

- `POST /api/trades`: Create a new trade (auth required)
- `GET /api/trade/:trade_id`: Get details of a specific trade by trade ID (auth required)
- `GET /api/trade/public/:trade_id`: Get public details of a trade by trade ID
- `GET /api/trades/user`: Get all trades for the current user (auth required)
- `PATCH /api/trades/:trade_id/status`: Update trade status (auth required)

### Ratings

- `POST /api/ratings`: Create a new rating (auth required)
- `PATCH /api/ratings`: Update a rating (auth required)
- `GET /api/ratings/user/:user_id`: Get all ratings by a user (auth required)
- `GET /api/ratings/trade/:trade_id`: Get all ratings for a trade (auth required)
- `GET /api/ratings/user/:user_id/average`: Get the average rating of a user (auth required)

### Comments

- `GET /api/comments/:trade_id`: Get all comments for a trade by trade ID (auth required)
- `GET /api/comment/:comment_id`: Get a specific comment by comment ID (auth required)
- `POST /api/comments`: Add a comment to a trade (auth required)

### Images

- `POST /api/image/upload`: Upload a new image (auth required)
- `GET /api/image/:image_id`: Get an image by ID
- `DELETE /api/image/:image_id`: Delete an image by ID (auth required)

## Setup

To run this backend on your local machine:

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the necessary environment variables:
   - `PORT=3000`
   - Database connection information (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`)
   - `JWT_SECRET` for JWT authentication
   - Email service credentials for Nodemailer
4. Start the server: `npm start`

## Dependencies

- `express`: Fast, unopinionated web framework for Node.js
- `cors`: A package to enable Cross-Origin Resource Sharing
- `dotenv`: Loads environment variables from `.env` files
- `jsonwebtoken`: Used for JWT-based authentication
- `nodemailer`: Email sending library
- `pg`: PostgreSQL client for Node.js

## Security

- JWT-based user authentication
- Passwords are hashed before being stored
- Sensitive information like database credentials and JWT secret is stored in a secure `.env` file

## Contributing

Feel free to open an issue or submit a pull request if you encounter any bugs or would like to contribute improvements to the API.

