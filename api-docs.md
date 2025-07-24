# 📚 Mobile Payment App - API Documentation

## 🔗 Base Information

**Base URL:** `http://localhost:3000/api`  
**API Version:** v1.0.0  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token  

## 📋 Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Transaction Endpoints](#transaction-endpoints)
  - [Payment Endpoints](#payment-endpoints)
  - [Utility Endpoints](#utility-endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Token Expiration:** 7 days (configurable)  
**Token Storage:** Securely store tokens using AsyncStorage or secure storage

## 📡 Endpoints

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**URL:** `POST /auth/signup`  
**Authentication:** None required  

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "psp" | "dev"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Minimum 6 characters
- `role`: Must be either "psp" or "dev"

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "psp"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `409 Conflict`: Email already exists

---

#### POST /auth/login
Authenticate user and receive JWT token.

**URL:** `POST /auth/login`  
**Authentication:** None required  

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "psp"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid credentials

---

### Transaction Endpoints

#### GET /transactions
Fetch authenticated user's transaction history.

**URL:** `GET /transactions`  
**Authentication:** Required (JWT Bearer Token)  

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": 1,
        "recipient": "Alice Johnson",
        "amount": 250.00,
        "currency": "USD",
        "status": "completed",
        "timestamp": "2024-01-20T10:30:00.000Z"
      },
      {
        "id": 2,
        "recipient": "Bob Smith",
        "amount": 150.75,
        "currency": "USD",
        "status": "completed",
        "timestamp": "2024-01-19T15:45:00.000Z"
      }
    ],
    "count": 2
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Transaction Object:**
- `id`: Unique transaction identifier
- `recipient`: Name of payment recipient
- `amount`: Payment amount (decimal)
- `currency`: ISO currency code
- `status`: Transaction status ("pending", "completed", "failed")
- `timestamp`: ISO 8601 timestamp

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Database error

---

### Payment Endpoints

#### POST /send
Send a payment to a recipient.

**URL:** `POST /send`  
**Authentication:** Required (JWT Bearer Token)  

**Headers:**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "recipient": "John Doe",
  "amount": 100.50,
  "currency": "USD"
}
```

**Validation Rules:**
- `recipient`: Required, 2-100 characters
- `amount`: Required, positive number (0.01 - 10,000.00)
- `currency`: Required, one of: USD, EUR, GBP, CAD, AUD

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Payment sent successfully",
  "data": {
    "transaction": {
      "id": 15,
      "recipient": "John Doe",
      "amount": 100.50,
      "currency": "USD",
      "status": "completed",
      "timestamp": "2024-01-20T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or payment processing failed
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

**Payment Processing:**
- Simulated 90% success rate for demonstration
- Real implementation would integrate with payment gateway
- Automatic webhook trigger on successful payment

---

### Utility Endpoints

#### GET /health
Check API health status.

**URL:** `GET /health`  
**Authentication:** None required  

**Success Response (200):**
```json
{
  "status": "success",
  "message": "API is healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600.52
}
```

---

## 📝 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "message": "Human readable success message",
  "data": { /* Response data */ },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Human readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## ❌ Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Client error (validation, malformed request) |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Endpoint or resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Scenarios

**Validation Errors (400):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ],
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Authentication Errors (401):**
```json
{
  "status": "error",
  "message": "Invalid token",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Resource Conflict (409):**
```json
{
  "status": "error",
  "message": "User with this email already exists",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 🚦 Rate Limiting

- **Rate Limit:** 100 requests per 15 minutes per IP address
- **Headers Included:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Time when rate limit resets

**Rate Limit Exceeded Response (429):**
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later.",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 🔄 Webhook Integration

When a payment is successfully processed via `POST /send`, the API automatically triggers a webhook to the configured URL.

**Webhook Configuration:**
```bash
WEBHOOK_URL=https://usewebhook.com/api/your-endpoint
```

**Webhook Payload:**
```json
{
  "event": "payment.completed",
  "data": {
    "transactionId": 15,
    "userId": 1,
    "recipient": "John Doe",
    "amount": 100.50,
    "currency": "USD",
    "status": "completed",
    "timestamp": "2024-01-20T10:30:00.000Z"
  },
  "timestamp": "2024-01-20T10:30:00.000Z",
  "source": "mobile-payment-app"
}
```

**Webhook Headers:**
```http
Content-Type: application/json
User-Agent: MobilePaymentApp/1.0
```

## 📋 Examples

### Complete Authentication Flow

**1. Register New User:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123",
    "role": "dev"
  }'
```

**2. Login User:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 3,
      "email": "newuser@example.com",
      "role": "dev"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJuZXd1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6ImRldiIsImlhdCI6MTY0Mjc2ODQwMCwiZXhwIjoxNjQzMzczMjAwfQ.example"
  }
}
```

### Complete Payment Flow

**1. Get Current Transactions:**
```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**2. Send Payment:**
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "recipient": "Jane Smith",
    "amount": 75.50,
    "currency": "USD"
  }'
```

**3. Verify Payment in Transactions:**
```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### JavaScript/Fetch Examples

**Login with JavaScript:**
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // Store token securely
      localStorage.setItem('authToken', data.data.token);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

**Send Payment with JavaScript:**
```javascript
const sendPayment = async (recipient, amount, currency) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('http://localhost:3000/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ recipient, amount, currency }),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Payment successful:', data.data.transaction);
      return data.data.transaction;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};
```

## 🧪 Testing

### Postman Collection

Import this collection for easy API testing:

```json
{
  "info": {
    "name": "Mobile Payment API",
    "description": "Complete API collection for mobile payment app"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "authToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"psp@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

### Demo Data

The API comes pre-seeded with demo data:

**Demo Users:**
```json
[
  {
    "id": 1,
    "email": "psp@example.com",
    "password": "password123",
    "role": "psp"
  },
  {
    "id": 2,
    "email": "dev@example.com",
    "password": "password123",
    "role": "dev"
  }
]
```

**Demo Transactions:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "recipient": "Alice Johnson",
    "amount": 250.00,
    "currency": "USD",
    "status": "completed"
  },
  {
    "id": 2,
    "user_id": 1,
    "recipient": "Bob Smith",
    "amount": 150.75,
    "currency": "USD",
    "status": "completed"
  }
]
```

## 🔧 Configuration

### Environment Variables

Required environment variables for the API:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Database Configuration
DATABASE_URL=./database.sqlite

# Webhook Configuration (Optional)
WEBHOOK_URL=https://usewebhook.com/api/webhook-endpoint
```

### CORS Configuration

Update CORS settings in `/src/app.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:19006',    // Expo web
    'http://localhost:8081',     // Expo dev server
    'https://your-domain.com'    // Production domain
  ],
  credentials: true
}));
```

## 📞 Support

- **GitHub Issues:** Report bugs and request features
- **API Status:** Check `/health` endpoint for service status
- **Rate Limits:** Monitor response headers for usage limits
- **Webhooks:** Verify webhook delivery with proper error handling

## 🔄 Changelog

### v1.0.0 (Current)
- Initial API release
- JWT authentication
- User registration and login
- Transaction management
- Payment processing
- Webhook integration
- Rate limiting
- Comprehensive error handling

### Future Versions
- v1.1.0: Enhanced security features
- v1.2.0: Advanced payment options
- v2.0.0: Multi-currency support and analytics

---

**Last Updated:** January 2024  
**API Version:** 1.0.0  
**Maintainer:** Wycliffe