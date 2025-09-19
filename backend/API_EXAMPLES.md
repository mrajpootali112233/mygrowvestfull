# MyGrowVest API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## cURL Examples

### Authentication Endpoints

#### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"email\": \"user@example.com\",
    \"password\": \"password123\",
    \"referralCode\": \"ABC12345\"
  }'
```

#### 2. Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"email\": \"user@example.com\",
    \"password\": \"password123\"
  }'
```

### User Management

#### 3. Get User Profile
```bash
curl -X GET http://localhost:3000/api/users/1 \\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"
```

#### 4. Update User (Admin Only)
```bash
curl -X PATCH http://localhost:3000/api/users/1 \\n  -H \"Authorization: Bearer ADMIN_JWT_TOKEN\" \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"isSuspended\": true
  }'
```

### Deposits

#### 5. Create Deposit with File Upload
```bash
curl -X POST http://localhost:3000/api/deposits \n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \n  -F \"amount=1000\" \n  -F \"method=bank_transfer\" \n  -F \"txId=TXN123456\" \n  -F \"proof=@/path/to/receipt.pdf\"
```

#### 6. Get All Deposits (Admin Only)
```bash
curl -X GET \"http://localhost:3000/api/deposits?status=pending\" \\n  -H \"Authorization: Bearer ADMIN_JWT_TOKEN\"
```

### Withdrawals

#### 7. Create Withdrawal Request
```bash
curl -X POST http://localhost:3000/api/withdrawals \\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"amount\": 500,
    \"methodDetails\": \"Bank: ABC Bank, Account: 1234567890\"
  }'
```

### Investments

#### 8. Activate Investment
```bash
curl -X POST http://localhost:3000/api/investments/activate \\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"planId\": 1,
    \"amount\": 1000
  }'
```

### Admin Operations

#### 9. Approve Deposit
```bash
curl -X PATCH http://localhost:3000/api/admin/deposits/1/approve \\n  -H \"Authorization: Bearer ADMIN_JWT_TOKEN\"
```

#### 10. Run Daily Profit Distribution
```bash
curl -X POST http://localhost:3000/api/admin/run-daily-profit \\n  -H \"Authorization: Bearer ADMIN_JWT_TOKEN\"
```

### Support Tickets

#### 11. Create Support Ticket
```bash
curl -X POST http://localhost:3000/api/tickets \\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"subject\": \"Account Issue\",
    \"message\": \"I cannot access my account\"
  }'
```

#### 12. Reply to Ticket (Admin Only)
```bash
curl -X POST http://localhost:3000/api/tickets/1/reply \\n  -H \"Authorization: Bearer ADMIN_JWT_TOKEN\" \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"reply\": \"Please try resetting your password\"
  }'
```

## Response Examples

### Successful Login Response
```json
{
  \"accessToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",
  \"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",
  \"user\": {
    \"id\": 1,
    \"email\": \"user@example.com\",
    \"role\": \"user\"
  }
}
```

### Error Response
```json
{
  \"statusCode\": 400,
  \"message\": [\"email must be a valid email\"],
  \"error\": \"Bad Request\"
}
```

## Testing with Postman

1. Import the collection or create requests manually
2. Set environment variables:
   - `base_url`: http://localhost:3000/api
   - `jwt_token`: (set after login)
3. Use {{jwt_token}} in Authorization headers

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error