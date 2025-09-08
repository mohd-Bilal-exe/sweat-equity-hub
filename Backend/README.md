# Sweatquity Backend API

Backend service for payment processing and other server-side operations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
   - Add your Stripe secret key
   - Add your Firebase Admin SDK credentials

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history/:userId` - Get payment history

### Health Check
- `GET /health` - API health status

## Environment Variables

See `.env.example` for required environment variables.