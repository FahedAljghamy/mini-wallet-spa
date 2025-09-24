# Mini Wallet API Documentation
**Author: Eng.Fahed**

## Overview
This is a comprehensive API documentation for the Mini Wallet application. The API provides authentication, wallet management, and transaction functionality.

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer your_token_here
```

## Response Format
All API responses follow this standard format:

### Success Response
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {
        // Response data here
    }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description",
    "error_code": "ERROR_CODE",
    "errors": {
        // Validation errors (if applicable)
    }
}
```

---

## 1. Authentication APIs

### 1.1 Register User
**Endpoint:** `POST /api/auth/register`  
**Authentication:** Not required  
**Description:** Register a new user account

#### Request Body
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

#### Validation Rules
- `name`: required, string, max 255 characters
- `email`: required, valid email, unique, max 255 characters
- `password`: required, string, minimum 8 characters, must be confirmed

#### Success Response (201)
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "balance": "$1,000.00",
            "balance_raw": 1000.0,
            "email_verified_at": "2024-01-01 12:00:00",
            "created_at": "2024-01-01 12:00:00",
            "updated_at": "2024-01-01 12:00:00"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### Error Response (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "error_code": "VALIDATION_ERROR",
    "errors": {
        "email": ["The email has already been taken."],
        "password": ["The password confirmation does not match."]
    }
}
```

---

### 1.2 Login User
**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required  
**Description:** Login user and get authentication token

#### Request Body
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

#### Validation Rules
- `email`: required, valid email
- `password`: required

#### Success Response (200)
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "balance": "$1,000.00",
            "balance_raw": 1000.0,
            "email_verified_at": "2024-01-01 12:00:00",
            "created_at": "2024-01-01 12:00:00",
            "updated_at": "2024-01-01 12:00:00"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### Error Response (401)
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

---

### 1.3 Get User Profile
**Endpoint:** `GET /api/auth/profile`  
**Authentication:** Required  
**Description:** Get authenticated user profile

#### Success Response (200)
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "balance": "$1,000.00",
            "balance_raw": 1000.0,
            "email_verified_at": "2024-01-01 12:00:00",
            "created_at": "2024-01-01 12:00:00",
            "updated_at": "2024-01-01 12:00:00"
        }
    }
}
```

---

### 1.4 Logout User
**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required  
**Description:** Logout user and revoke current token

#### Success Response (200)
```json
{
    "success": true,
    "message": "Logout successful"
}
```

---

## 2. Wallet APIs

### 2.1 Get Wallet Balance
**Endpoint:** `GET /api/wallet/balance`  
**Authentication:** Required  
**Description:** Get current wallet balance

#### Success Response (200)
```json
{
    "success": true,
    "data": {
        "balance": 1000.00,
        "currency": "USD"
    }
}
```

---

### 2.2 Add Money to Wallet
**Endpoint:** `POST /api/wallet/add-money`  
**Authentication:** Required  
**Description:** Add money to wallet (for testing purposes)

#### Request Body
```json
{
    "amount": 100.00
}
```

#### Validation Rules
- `amount`: required, numeric, minimum 0.01, maximum 10000

#### Success Response (200)
```json
{
    "success": true,
    "message": "Money added successfully",
    "data": {
        "new_balance": 1100.00
    }
}
```

#### Error Response (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "error_code": "VALIDATION_ERROR",
    "errors": {
        "amount": ["The amount must be at least 0.01."]
    }
}
```

---

### 2.3 Get Wallet Statistics
**Endpoint:** `GET /api/wallet/statistics`  
**Authentication:** Required  
**Description:** Get wallet statistics and transaction summary

#### Success Response (200)
```json
{
    "success": true,
    "data": {
        "current_balance": 1000.00,
        "total_sent": 500.00,
        "total_received": 300.00,
        "total_commission_paid": 25.00,
        "sent_transactions_count": 5,
        "received_transactions_count": 3,
        "total_transactions_count": 8
    }
}
```

---

## 3. Transaction APIs

### 3.1 Get All Transactions
**Endpoint:** `GET /api/transactions`  
**Authentication:** Required  
**Description:** Get paginated list of user transactions with current balance

#### Query Parameters
- `page` (optional): Page number for pagination (default: 1)

#### Example Request
```
GET /api/transactions?page=1
```

#### Success Response (200)
```json
{
    "success": true,
    "message": "Transactions retrieved successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "balance": "$1,000.00",
            "balance_raw": 1000.0,
            "email_verified_at": "2024-01-01 12:00:00",
            "created_at": "2024-01-01 12:00:00",
            "updated_at": "2024-01-01 12:00:00"
        },
        "current_balance": "1,000.00",
        "transactions": {
            "data": [
                {
                    "id": 1,
                    "amount": "$50.00",
                    "amount_raw": 50.0,
                    "commission_fee": "$2.50",
                    "commission_fee_raw": 2.5,
                    "total_amount": "$52.50",
                    "total_amount_raw": 52.5,
                    "status": "completed",
                    "status_label": "Completed",
                    "sender": {
                        "id": 1,
                        "name": "John Doe",
                        "email": "john@example.com"
                    },
                    "receiver": {
                        "id": 2,
                        "name": "Jane Smith",
                        "email": "jane@example.com"
                    },
                    "created_at": "2024-01-01 12:00:00",
                    "updated_at": "2024-01-01 12:00:00",
                    "created_at_human": "2 hours ago"
                }
            ],
            "current_page": 1,
            "last_page": 1,
            "per_page": 15,
            "total": 1,
            "from": 1,
            "to": 1
        },
        "pagination": {
            "current_page": 1,
            "last_page": 1,
            "per_page": 15,
            "total": 1,
            "from": 1,
            "to": 1
        }
    }
}
```

---

### 3.2 Create Transaction
**Endpoint:** `POST /api/transactions`  
**Authentication:** Required  
**Description:** Create a new transaction (transfer money to another user)

#### Request Body
```json
{
    "receiver_email": "jane@example.com",
    "amount": 50.00,
    "commission_fee": 2.50
}
```

#### Validation Rules
- `receiver_email`: required, valid email, must exist in users table
- `amount`: required, numeric, minimum 0.01, maximum 100000
- `commission_fee`: optional, numeric, minimum 0, maximum 1000

#### Success Response (201)
```json
{
    "success": true,
    "message": "Transaction completed successfully",
    "data": {
        "transaction": {
            "id": 1,
            "amount": "$50.00",
            "amount_raw": 50.0,
            "commission_fee": "$2.50",
            "commission_fee_raw": 2.5,
            "total_amount": "$52.50",
            "total_amount_raw": 52.5,
            "status": "completed",
            "status_label": "Completed",
            "sender": {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com"
            },
            "receiver": {
                "id": 2,
                "name": "Jane Smith",
                "email": "jane@example.com"
            },
            "created_at": "2024-01-01 12:00:00",
            "updated_at": "2024-01-01 12:00:00",
            "created_at_human": "2 hours ago"
        },
        "sender_balance": "947.50",
        "receiver_balance": "1,050.00"
    }
}
```

#### Error Responses

**Insufficient Balance (422)**
```json
{
    "success": false,
    "message": "Transaction failed",
    "error": "Insufficient balance",
    "error_code": "INSUFFICIENT_BALANCE"
}
```

**Invalid Receiver (422)**
```json
{
    "success": false,
    "message": "Transaction failed",
    "error": "Cannot transfer to yourself",
    "error_code": "INVALID_RECEIVER"
}
```

**Unverified Account (422)**
```json
{
    "success": false,
    "message": "Transaction failed",
    "error": "Cannot transfer to unverified account",
    "error_code": "UNVERIFIED_ACCOUNT"
}
```

**Validation Error (422)**
```json
{
    "success": false,
    "message": "Transaction failed",
    "error_code": "VALIDATION_ERROR",
    "errors": {
        "receiver_email": ["The selected receiver email does not exist in our system."],
        "amount": ["The transfer amount must be at least $0.01."]
    }
}
```

---

### 3.3 Get Transaction Details
**Endpoint:** `GET /api/transactions/{id}`  
**Authentication:** Required  
**Description:** Get details of a specific transaction

#### URL Parameters
- `id`: Transaction ID

#### Success Response (200)
```json
{
    "success": true,
    "message": "Transaction retrieved successfully",
    "data": {
        "id": 1,
        "amount": "$50.00",
        "amount_raw": 50.0,
        "commission_fee": "$2.50",
        "commission_fee_raw": 2.5,
        "total_amount": "$52.50",
        "total_amount_raw": 52.5,
        "status": "completed",
        "status_label": "Completed",
        "sender": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        },
        "receiver": {
            "id": 2,
            "name": "Jane Smith",
            "email": "jane@example.com"
        },
        "created_at": "2024-01-01 12:00:00",
        "updated_at": "2024-01-01 12:00:00",
        "created_at_human": "2 hours ago"
    }
}
```

#### Error Response (404)
```json
{
    "success": false,
    "message": "Transaction not found"
}
```

---

### 3.4 Get Transaction Statistics
**Endpoint:** `GET /api/transactions/statistics`  
**Authentication:** Required  
**Description:** Get transaction statistics for the authenticated user

#### Success Response (200)
```json
{
    "success": true,
    "message": "Statistics retrieved successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "balance": "$1,000.00",
            "balance_raw": 1000.0,
            "email_verified_at": "2024-01-01 12:00:00",
            "created_at": "2024-01-01 12:00:00",
            "updated_at": "2024-01-01 12:00:00"
        },
        "statistics": {
            "total_sent": "500.00",
            "total_received": "300.00",
            "total_commission_paid": "25.00",
            "sent_count": 5,
            "received_count": 3,
            "total_transactions": 8
        }
    }
}
```

---

## 4. Error Codes Reference

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `INSUFFICIENT_BALANCE` | User doesn't have enough balance for transaction |
| `INVALID_RECEIVER` | Cannot transfer to yourself |
| `UNVERIFIED_ACCOUNT` | Cannot transfer to unverified account |
| `TRANSACTION_FAILED` | General transaction processing error |

---

## 5. HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 401 | Unauthorized (invalid credentials or missing token) |
| 404 | Resource not found |
| 422 | Validation error or business logic error |
| 500 | Internal server error |

---

## 6. Data Types

### User Object
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "balance": "$1,000.00",
    "balance_raw": 1000.0,
    "email_verified_at": "2024-01-01 12:00:00",
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00"
}
```

### Transaction Object
```json
{
    "id": 1,
    "amount": "$50.00",
    "amount_raw": 50.0,
    "commission_fee": "$2.50",
    "commission_fee_raw": 2.5,
    "total_amount": "$52.50",
    "total_amount_raw": 52.5,
    "status": "completed",
    "status_label": "Completed",
    "sender": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "receiver": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
    },
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00",
    "created_at_human": "2 hours ago"
}
```

---

## 7. Frontend Integration Notes

### Authentication Flow
1. Register/Login to get token
2. Store token in localStorage/sessionStorage
3. Include token in Authorization header for protected requests
4. Handle token expiration (401 responses)

### Transaction Flow
1. Validate receiver email exists
2. Check user has sufficient balance
3. Show commission fee calculation
4. Confirm transaction details
5. Process transaction
6. Update UI with new balances

### Error Handling
- Always check `success` field in response
- Handle validation errors by displaying field-specific messages
- Show user-friendly error messages for business logic errors
- Implement retry logic for network errors

### Pagination
- Use `pagination` object for transaction lists
- Implement infinite scroll or page navigation
- Default page size is 15 transactions

---

## 8. Testing

### Postman Collection
A complete Postman collection is available at: `postman/Mini_Wallet_API.postman_collection.json`

### Environment Variables
- `base_url`: http://localhost:8000
- `auth_token`: (set after login)

### Test Data
- New users get $1,000 starting balance
- Use `add-money` endpoint to add test funds
- Create multiple test users for transaction testing

---

**Author: Eng.Fahed**  
**Last Updated: 2024**
