# 💳 Mobile Payment App - Complete Solution

> **A production-ready mobile payment application built with Node.js, Express, and React Native (Expo), showcasing enterprise-level architecture and 10X engineering practices.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green.svg)
![Frontend](https://img.shields.io/badge/frontend-React%20Native%20%2B%20Expo-blue.svg)
![Database](https://img.shields.io/badge/database-SQLite-orange.svg)
![Auth](https://img.shields.io/badge/auth-JWT-red.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Installation](#-installation)
- [📱 Usage](#-usage)
- [🔒 Security](#-security)
- [📚 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Overview

This mobile payment application demonstrates enterprise-grade development practices with a complete full-stack solution. It features a secure Node.js/Express backend API with JWT authentication and a modern React Native frontend built with Expo.

### 🎥 Demo

**Live Demo:** `http://localhost:19006` (after setup)

**Video Walkthrough:** [5-minute demo covering architecture, features, and technical decisions]

## ✨ Key Features

### 🔐 Authentication System
- **User Registration** with role selection (PSP/Developer)
- **Secure JWT Authentication** with token persistence
- **Role-based Access Control** and user experiences
- **Auto-logout** on token expiration

### 💸 Payment Processing
- **Send Payments** with real-time validation
- **Multi-currency Support** (USD, EUR, GBP, CAD, AUD)
- **Payment Confirmation** dialogs and feedback
- **Transaction History** with status tracking
- **Webhook Integration** for external systems

### 📊 Dashboard Features
- **Personalized Welcome** with user statistics
- **Transaction Analytics** (total sent, completed payments)
- **Role-based Notifications**:
  - PSP: "You have X merchants connected"
  - Developer: "You've made Y API calls this week"
- **Pull-to-refresh** functionality
- **Real-time Updates** after payment success

### 🛡️ Security Features
- **JWT Token Security** with secure storage
- **Password Hashing** using bcrypt
- **Input Validation** with Joi schemas
- **CORS Protection** with configurable origins
- **Rate Limiting** (100 requests/15 minutes)
- **SQL Injection Prevention**

## 🏗️ Architecture

### Backend Architecture (Node.js + Express)
```
├── Controllers/     # HTTP request handlers
├── Services/        # Business logic layer
├── Middleware/      # Auth, validation, error handling
├── Models/          # Data models and database
├── Routes/          # API route definitions
├── Config/          # Database and JWT configuration
└── Utils/           # Helper functions and constants
```

### Frontend Architecture (React Native + Expo)
```
├── Components/      # Reusable UI components
├── Screens/         # Screen components
├── Navigation/      # Navigation configuration
├── Context/         # React context providers
├── Services/        # API services and storage
├── Hooks/           # Custom React hooks
├── Types/           # TypeScript type definitions
└── Utils/           # Helper functions and constants
```

### Technology Stack

**Backend:**
- **Runtime:** Node.js v16+
- **Framework:** Express.js v4.18+
- **Database:** SQLite v5.1+ (production: PostgreSQL)
- **Authentication:** JWT with bcrypt
- **Validation:** Joi schemas
- **Security:** Helmet.js, CORS, Rate limiting

**Frontend:**
- **Framework:** React Native v0.72+ with Expo
- **Language:** TypeScript v4.8+
- **Navigation:** Custom navigation for web
- **Storage:** AsyncStorage
- **HTTP Client:** Axios v1.6+
- **UI:** Custom component library

**Development Tools:**
- **Linting:** ESLint with React Native config
- **Formatting:** Prettier
- **Testing:** Jest + React Native Testing Library
- **API Testing:** Postman/Thunder Client

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm v7+
- Git
- Text editor (VS Code recommended)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd mobile-payment-app
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd mobile
npm install
npx expo start --web
```

### 4. Test the Application
- **Backend Health:** `http://localhost:3000/health`
- **Frontend App:** `http://localhost:19006`
- **Demo Login:** `psp@example.com` / `password123`

## 📁 Project Structure

```
mobile-payment-app/
├── backend/                          # Node.js API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # SQLite database configuration
│   │   │   └── jwt.js               # JWT token configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication endpoints
│   │   │   ├── transactionController.js # Transaction management
│   │   │   └── paymentController.js # Payment processing
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── validation.js        # Request validation
│   │   │   └── errorHandler.js      # Global error handling
│   │   ├── models/                  # Data models (implicit with SQLite)
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── transactions.js      # Transaction routes
│   │   │   └── payments.js          # Payment routes
│   │   ├── services/
│   │   │   ├── authService.js       # Authentication business logic
│   │   │   ├── transactionService.js # Transaction management
│   │   │   ├── paymentService.js    # Payment processing
│   │   │   └── webhookService.js    # Webhook integration
│   │   ├── utils/
│   │   │   ├── logger.js            # Logging utility
│   │   │   ├── response.js          # Standardized responses
│   │   │   └── constants.js         # Application constants
│   │   └── app.js                   # Express application setup
│   ├── tests/                       # API tests
│   ├── package.json                 # Dependencies and scripts
│   ├── .env.example                 # Environment variables template
│   └── server.js                    # Server entry point
│
├── mobile/                          # React Native Expo App
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button/          # Reusable button component
│   │   │   │   ├── Input/           # Form input component
│   │   │   │   └── LoadingSpinner/  # Loading indicator
│   │   │   └── transaction/
│   │   │       ├── TransactionList/ # Transaction list component
│   │   │       └── TransactionItem/ # Individual transaction
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen/     # User login interface
│   │   │   │   └── SignupScreen/    # User registration
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardScreen/ # Main dashboard
│   │   │   └── payment/
│   │   │       └── SendPaymentScreen/ # Payment form
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx     # App navigation logic
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   └── ToastContext.tsx     # Toast notifications
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── apiClient.ts     # HTTP client configuration
│   │   │   │   ├── authApi.ts       # Authentication API calls
│   │   │   │   ├── transactionApi.ts # Transaction API calls
│   │   │   │   └── paymentApi.ts    # Payment API calls
│   │   │   └── storage/
│   │   │       └── secureStorage.ts # Token storage management
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Authentication hook
│   │   │   └── useTransactions.ts   # Transaction management hook
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript type definitions
│   │   ├── utils/
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── validation.ts        # Form validation
│   │   │   └── helpers.ts           # Utility functions
│   │   └── styles/
│   │       └── globalStyles.ts      # Global style definitions
│   ├── App.tsx                      # Root application component
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── babel.config.js              # Babel configuration
│   └── app.json                     # Expo configuration
│
├── docs/                            # Documentation
│   ├── api-docs.md                  # API endpoint documentation
│   ├── setup-guide.md               # Detailed setup instructions
│   └── architecture.md              # Architecture decisions
│
├── README.md                        # Project overview (this file)
└── .gitignore                       # Git ignore patterns
```

## 🔧 Installation

### Backend Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```bash
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   DATABASE_URL=./database.sqlite
   WEBHOOK_URL=https://usewebhook.com/api/webhook-endpoint
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Installation

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Expo CLI (if not installed):**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start development server:**
   ```bash
   npx expo start --web
   ```

## 📱 Usage

### Demo Accounts

The application comes with pre-seeded demo accounts:

**PSP Account:**
- Email: `psp@example.com`
- Password: `password123`
- Role: Payment Service Provider
- Features: Merchant management focus

**Developer Account:**
- Email: `dev@example.com`
- Password: `password123`
- Role: Developer
- Features: API usage statistics

### Application Flow

1. **Authentication:**
   - Open `http://localhost:19006`
   - Login with demo credentials
   - Receive role-based welcome message

2. **Dashboard:**
   - View transaction statistics
   - See recent transaction history
   - Access quick actions

3. **Send Payment:**
   - Click "Send Payment" button
   - Fill payment form:
     - Recipient name (min 2 characters)
     - Amount ($0.01 - $10,000)
     - Currency selection
   - Confirm payment
   - Receive success/failure notification

4. **Transaction Management:**
   - View all transactions in dashboard
   - Pull to refresh for latest data
   - Automatic updates after new payments

### API Usage

**Authentication:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"psp@example.com","password":"password123"}'
```

**Send Payment:**
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"recipient":"John Doe","amount":50.00,"currency":"USD"}'
```

**Get Transactions:**
```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security

### Authentication Security
- **JWT Tokens:** Stateless authentication with configurable expiration
- **Password Hashing:** bcrypt with 10 salt rounds
- **Token Storage:** Secure AsyncStorage on mobile
- **Auto-logout:** On token expiration or invalid tokens

### API Security
- **Input Validation:** Joi schema validation on all endpoints
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Configurable allowed origins
- **Security Headers:** Helmet.js for security headers
- **SQL Injection Prevention:** Parameterized queries

### Data Protection
- **Environment Variables:** Sensitive configuration in .env
- **Token Verification:** All protected routes verify JWT
- **Error Handling:** No sensitive data in error responses
- **Request Logging:** Morgan for HTTP request logging

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "psp" | "dev"
}
```

**Response (201):**
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
  }
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
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
  }
}
```

### Transaction Endpoints

#### GET /transactions
Fetch user's transaction history (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
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
      }
    ],
    "count": 1
  }
}
```

### Payment Endpoints

#### POST /send
Send a payment to a recipient (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "recipient": "John Doe",
  "amount": 100.50,
  "currency": "USD"
}
```

**Response (201):**
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
  }
}
```

### Utility Endpoints

#### GET /health
Check API health status (no authentication required).

**Response (200):**
```json
{
  "status": "success",
  "message": "API is healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600.52
}
```

### Error Responses

All endpoints return standardized error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error

## 🧪 Testing

### Backend Testing

**Run all tests:**
```bash
cd backend
npm test
```

**Test specific endpoints:**
```bash
# Test authentication
npm run test:auth

# Test payments
npm run test:payments
```

**Manual API Testing:**
```bash
# Health check
curl http://localhost:3000/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"psp@example.com","password":"password123"}'
```

### Frontend Testing

**Run component tests:**
```bash
cd mobile
npm test
```

**Test user flows:**
1. Authentication flow (login/logout)
2. Dashboard functionality
3. Payment submission
4. Error handling scenarios

### Integration Testing

**Complete flow test:**
1. Start both backend and frontend
2. Login with demo account
3. Send test payment
4. Verify transaction appears in dashboard
5. Test error scenarios (invalid data, network issues)

## 🚀 Deployment

### Backend Deployment (Production)

1. **Environment Setup:**
   ```bash
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=complex-production-secret
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

2. **Database Migration:**
   ```bash
   # For PostgreSQL production
   npm run db:migrate
   npm run db:seed
   ```

3. **Process Management:**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start server.js --name mobile-payment-api
   pm2 startup
   pm2 save
   ```

4. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-api-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Deployment

**Web Deployment:**
```bash
cd mobile
npx expo export --platform web
# Deploy /dist folder to your hosting service
```

**Mobile App Deployment:**
```bash
# Build for app stores
npx expo build:android
npx expo build:ios

# Or use EAS Build
npx eas build --platform all
```

### Docker Deployment (Optional)

**Dockerfile (Backend):**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mobile_payment
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: mobile_payment
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Make changes and test thoroughly**
4. **Commit changes:** `git commit -m 'Add amazing feature'`
5. **Push to branch:** `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Code Standards

- **ESLint + Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages
- **Jest** for unit testing
- **JSDoc** for function documentation

### Pull Request Guidelines

- Ensure all tests pass
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Include description of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Native Community** for excellent documentation
- **Expo Team** for simplified development workflow
- **Express.js** for robust backend framework
- **JWT.io** for authentication standards
- **SQLite** for reliable database solution

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/mobile-payment-app/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/mobile-payment-app/discussions)
- **Email:** your-email@example.com

## 🎯 Roadmap

### Version 1.1
- [ ] React Navigation integration
- [ ] Push notifications
- [ ] Biometric authentication
- [ ] Payment history export

### Version 1.2
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Transaction filters and search
- [ ] Payment scheduling

### Version 2.0
- [ ] Cryptocurrency support
- [ ] Advanced analytics dashboard
- [ ] Merchant onboarding flow
- [ ] API rate plan management

---

**Built with ❤️ using modern development practices and enterprise-grade architecture.**