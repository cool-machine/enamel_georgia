# Payment Integration Setup Guide

## Stripe Configuration for Enamel Georgia E-commerce

### 1. Stripe Account Setup

1. **Create Stripe Account**: Visit [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: Go to Developers > API keys in your Stripe dashboard
3. **Copy Keys**: 
   - **Publishable Key** (starts with `pk_test_` for test mode)
   - **Secret Key** (starts with `sk_test_` for test mode)

### 2. Environment Configuration

Add these variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Webhook Setup

1. **Create Webhook Endpoint** in Stripe Dashboard:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/v1/payments/webhook`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `payment_intent.requires_action`

2. **Copy Webhook Secret**: Save the webhook signing secret to your `.env` file

### 4. Currency Configuration

The system is configured for **Georgian Lari (GEL)**:
- Currency code: `gel`
- Symbol: `₾`
- Minimum amount: 0.50 GEL
- Maximum amount: 1,000,000 GEL

### 5. Payment Flow

#### Frontend Integration
1. **Get payment configuration**:
   ```javascript
   GET /api/v1/payments/config
   ```

2. **Create payment intent**:
   ```javascript
   POST /api/v1/payments/intent
   {
     "orderId": "order_123",
     "returnUrl": "https://yoursite.com/success"
   }
   ```

3. **Use Stripe.js to confirm payment**:
   ```javascript
   POST /api/v1/payments/confirm
   {
     "paymentIntentId": "pi_123",
     "paymentMethodId": "pm_123"
   }
   ```

#### Backend Processing
1. **Payment Intent Created**: Order remains PENDING
2. **Payment Confirmed**: Webhook updates order to PAID
3. **Payment Failed**: Order remains PENDING, user can retry

### 6. Available API Endpoints

#### Public Endpoints
- `GET /payments/config` - Payment configuration
- `GET /payments/methods` - Available payment methods
- `POST /payments/webhook` - Stripe webhook handler

#### User Endpoints (Authentication Required)
- `POST /payments/intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `GET /payments/status/:id` - Get payment status
- `GET /payments/my` - User's payment history

#### Admin Endpoints (Admin Role Required)
- `POST /payments/refund` - Process refunds

### 7. Testing

#### Test Cards (Stripe Test Mode)
- **Successful payment**: `4242424242424242`
- **Requires authentication**: `4000002500003155`
- **Declined payment**: `4000000000000002`

#### Test Commands
```bash
# Test payment endpoints
npm run test:payments

# Test complete e-commerce flow
npm run test:cart
```

### 8. Security Features

- **Webhook Verification**: All webhooks are verified using Stripe signatures
- **Authentication**: Payment endpoints require user authentication
- **Authorization**: Refunds require admin role
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive validation with Joi schemas

### 9. Error Handling

The system handles various payment scenarios:
- **Insufficient funds**: Clear error messages
- **Card declined**: Retry with different payment method
- **Network issues**: Automatic retry mechanisms
- **Webhook failures**: Logged and can be manually processed

### 10. Production Deployment

#### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_live_your_actual_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

#### SSL Configuration
- Ensure HTTPS is enabled
- Update `RETURN_URL` in Stripe config
- Configure proper CORS for production domain

#### Monitoring
- Monitor webhook delivery in Stripe dashboard
- Set up alerts for failed payments
- Regular reconciliation of payments with orders

### 11. Georgian Market Considerations

- **Local Payment Methods**: Consider adding Georgian payment providers
- **Tax Handling**: Configure Georgian VAT if applicable
- **Compliance**: Ensure compliance with Georgian payment regulations
- **Customer Support**: Provide Georgian language support for payment issues

### 12. Troubleshooting

#### Common Issues
1. **Webhook not working**: Check endpoint URL and signing secret
2. **Payment not confirming**: Verify client-side Stripe.js integration
3. **Currency issues**: Ensure all amounts are in tetri (smallest unit)
4. **Authentication errors**: Check JWT token validation

#### Logs
Payment operations are logged with context:
```bash
# View payment logs
docker logs your_container | grep payment
```

### 13. Future Enhancements

- **Recurring payments**: For subscription products
- **Multi-currency**: Support for USD, EUR
- **Local payment methods**: Bank transfers, mobile payments
- **Installment plans**: Split payments over time
- **Cryptocurrency**: Bitcoin, Ethereum support