# ShieldPay Assessment

A Node.js backend application with authentication and wallet functionality for the technical assessment at ShieldPay.

## Prerequisites

- Node.js and yarn installed
- PostgreSQL database

## Setup

1. Clone the repository
2. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
3. Run setup command:
   ```bash
   yarn setup
   ```
   This will install dependencies, run database migrations and generate Prisma client.

## Running

To run the application in development mode with hot reloading:
```bash
yarn dev
```
Else, to run the application in production mode by building the modules:
```bash
yarn build && yarn start
```

## API Endpoints

### Authentication

#### POST `/signup`  
Register a new user
- Request Body:
  - `email`: string (valid email format)
  - `password`: string
- Response:
  - `token`: JWT token
  - `user`: User object (id, email)

#### POST `/signin`
Sign in with existing credentials
- Request Body:
  - `email`: string
  - `password`: string
- Response:
  - `token`: JWT token

### Wallets

#### POST `/wallets`
Create a new wallet (requires authentication)
- Request Headers:
  - `Authorization`: Bearer token
- Request Body:
  - `name`: string
  - `balance`: number (optional, defaults to 0)
- Response:
  - Wallet object (id, name, balance, userId)

#### GET `/wallets`
Get all wallets for authenticated user
- Request Headers:
  - `Authorization`: Bearer token
- Response:
  - Array of wallet objects

#### GET `/wallets/:id`
Get specific wallet by ID
- Request Headers:
  - `Authorization`: Bearer token
- URL Parameters:
  - `id`: Wallet ID
- Response:
  - Wallet object (id, name, balance, userId)
#### PUT /wallets/:id
Update wallet balance
- Request Headers:
  - `Authorization`: Bearer token
- URL Parameters:
  - `id`: Wallet ID
- Request Body:
  - `balance`: number
- Response:
  - Updated wallet object

#### DELETE /wallets/:id
Delete a wallet
- Request Headers:
  - `Authorization`: Bearer token
- URL Parameters:
  - `id`: Wallet ID
- Response:
  - Success message

### Error Responses
All endpoints may return the following error responses:
- 400: Invalid Request
- 401: Unauthorized/Invalid credentials
- 404: Not Found
- 409: Resource already exists
- 500: Internal Server Error




