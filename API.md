# API Documentation

Complete API reference for the Smart Event Check-in System.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://smart-event-checkin-sever.onrender.com`
   **swagger**: ` https://smart-event-checkin-sever.onrender.com/api-docs/`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer {your-jwt-token}
```

### Get Token

Login via `/api/auth/login` to receive your JWT token.

---

## Authentication Endpoints

### POST /api/auth/login

Login to get JWT token.

**Request Body:**
```json
{
  "email": "admin@lahn.test",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@lahn.test",
    "role": "admin",
    "status": "active"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `401`: Invalid credentials

---

### GET /api/auth/me

Get current user info.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@lahn.test",
    "role": "admin",
    "status": "active",
    "permissions": []
  }
}
```

**Errors:**
- `401`: Unauthorized - Invalid or missing token

---

### POST /api/auth/setup-password

Setup password for a new staff account via activation token.

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password set successfully"
}
```

**Errors:**
- `400`: Invalid or expired token

---

## Event Endpoints

### GET /api/events

Get all events.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "events": [
    {
      "id": 1,
      "name": "Tech Conference 2024",
      "date": "2024-07-15T09:00:00.000Z",
      "location": "Convention Center",
      "image_url": "/uploads/event-123.jpg",
      "status": "active",
      "created_at": "2024-07-01T10:00:00.000Z",
      "updated_at": "2024-07-01T10:00:00.000Z"
    }
  ]
}
```

---

### GET /api/events/:id

Get event by ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "event": {
    "id": 1,
    "name": "Tech Conference 2024",
    "date": "2024-07-15T09:00:00.000Z",
    "location": "Convention Center",
    "image_url": "/uploads/event-123.jpg",
    "status": "active",
    "created_at": "2024-07-01T10:00:00.000Z",
    "updated_at": "2024-07-01T10:00:00.000Z"
  }
}
```

**Errors:**
- `404`: Event not found

---

### POST /api/events

Create new event (Admin only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "name": "Tech Conference 2024",
  "date": "2024-07-15T09:00:00.000Z",
  "location": "Convention Center",
  "status": "active",
  "image": [binary file]
}
```

**Response (201):**
```json
{
  "success": true,
  "event": {
    "id": 1,
    "name": "Tech Conference 2024",
    "date": "2024-07-15T09:00:00.000Z",
    "location": "Convention Center",
    "image_url": "/uploads/event-123.jpg",
    "status": "active",
    "created_at": "2024-07-01T10:00:00.000Z",
    "updated_at": "2024-07-01T10:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Validation error
- `403`: Forbidden (Admin role required)

---

### PUT /api/events/:id

Update event (Admin only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "name": "Updated Event Name",
  "date": "2024-07-16T09:00:00.000Z",
  "location": "New Location",
  "status": "completed",
  "image": [binary file]
}
```

**Response (200):**
```json
{
  "success": true,
  "event": {
    "id": 1,
    "name": "Updated Event Name",
    "date": "2024-07-16T09:00:00.000Z",
    "location": "New Location",
    "status": "completed",
    "image_url": "/uploads/event-456.jpg",
    "created_at": "2024-07-01T10:00:00.000Z",
    "updated_at": "2024-07-02T10:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Validation error
- `403`: Forbidden (Admin role required)
- `404`: Event not found

---

### DELETE /api/events/:id

Delete event (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Errors:**
- `403`: Forbidden (Admin role required)
- `404`: Event not found

---

### GET /api/events/:id/stats

Get event statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_visitors": 100,
    "checked_in": 75,
    "not_checked_in": 25,
    "check_in_percentage": 75,
    "recentCheckIns": [
      {
        "id": 1,
        "full_name": "John Doe",
        "company": "Tech Corp",
        "checked_in_at": "2024-07-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### POST /api/events/:id/assistant

Ask event-specific AI assistant.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "question": "How many visitors checked in?"
}
```

**Response (200):**
```json
{
  "success": true,
  "answer": "Based on the current event statistics, 75 out of 100 visitors have checked in, which is a 75% check-in rate."
}
```

---

## Visitor Endpoints

### GET /api/visitors/:eventId/visitors

Get visitors for an event.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "visitors": [
    {
      "id": 1,
      "event_id": 1,
      "full_name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "company": "Tech Corp",
      "check_in_token": "TKN-ABC123",
      "checked_in": true,
      "checked_in_at": "2024-07-15T10:30:00.000Z",
      "created_at": "2024-07-01T10:00:00.000Z"
    }
  ]
}
```

---

### GET /api/visitors/:eventId/visitors/search

Search visitors.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `q`: Search term (searches name, phone, email)

**Response (200):**
```json
{
  "success": true,
  "visitors": [
    {
      "id": 1,
      "full_name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "check_in_token": "TKN-ABC123",
      "checked_in": true
    }
  ]
}
```

---

### POST /api/visitors/:eventId/visitors

Create visitor.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "phone": "+0987654321",
  "email": "jane@example.com",
  "company": "Startup Inc"
}
```

**Response (201):**
```json
{
  "success": true,
  "visitor": {
    "id": 2,
    "event_id": 1,
    "full_name": "Jane Smith",
    "phone": "+0987654321",
    "email": "jane@example.com",
    "company": "Startup Inc",
    "check_in_token": "TKN-XYZ789",
    "checked_in": false,
    "created_at": "2024-07-02T10:00:00.000Z"
  }
}
```

---

### POST /api/visitors/:eventId/visitors/bulk

Bulk create visitors.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "visitors": [
    {
      "full_name": "User One",
      "phone": "+1111111111",
      "email": "user1@example.com"
    },
    {
      "full_name": "User Two",
      "phone": "+2222222222",
      "email": "user2@example.com"
    }
  ],
  "sendEmails": true
}
```

**Response (201):**
```json
{
  "success": true,
  "count": 2,
  "message": "2 visitors imported successfully"
}
```

---

### GET /api/visitors/:eventId/export

Export visitors to CSV.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** CSV file download

---

### PUT /api/visitors/:id

Update visitor.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "phone": "+3333333333",
  "email": "updated@example.com",
  "company": "New Company"
}
```

**Response (200):**
```json
{
  "success": true,
  "visitor": {
    "id": 1,
    "full_name": "Updated Name",
    "phone": "+3333333333",
    "email": "updated@example.com",
    "company": "New Company"
  }
}
```

---

### DELETE /api/visitors/:id

Delete visitor (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Visitor deleted successfully"
}
```

**Errors:**
- `403`: Forbidden (Admin role required)

---

## Check-in Endpoints

### POST /api/check-in/

Check in visitor using token.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "token": "TKN-ABC123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Check-in successful",
  "visitor": {
    "id": 1,
    "full_name": "John Doe",
    "checked_in": true,
    "checked_in_at": "2024-07-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `400`: Invalid token or duplicate check-in

---

## User Endpoints

### GET /api/users

Get all users (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@lahn.test",
      "role": "admin",
      "status": "active",
      "permissions": []
    }
  ]
}
```

**Errors:**
- `403`: Forbidden (Admin role required)

---

### POST /api/users

Create staff account (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Staff User",
  "email": "staff@lahn.test",
  "permissions": ["checkin", "manage_visitors"]
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "name": "Staff User",
    "email": "staff@lahn.test",
    "role": "staff",
    "status": "pending",
    "permissions": ["checkin", "manage_visitors"]
  },
  "activationLink": "http://localhost:5173/setup-password?token=abc123..."
}
```

**Errors:**
- `400`: Validation error or email already exists
- `403`: Forbidden (Admin role required)

---

### PUT /api/users/:id

Update staff account (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Updated Staff Name",
  "permissions": ["checkin", "manage_visitors", "view_stats"]
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "name": "Updated Staff Name",
    "email": "staff@lahn.test",
    "role": "staff",
    "permissions": ["checkin", "manage_visitors", "view_stats"]
  }
}
```

**Errors:**
- `400`: Validation error
- `403`: Forbidden (Admin role required)

---

### POST /api/users/:id/send-activation

Send activation email to staff (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Activation email sent successfully"
}
```

**Errors:**
- `400`: User is not pending
- `404`: User not found

---

## Stats Endpoints

### GET /api/stats/global

Get global statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_events": 5,
    "total_visitors": 500,
    "checked_in": 350,
    "not_checked_in": 150,
    "check_in_percentage": 70,
    "latest_check_ins": [
      {
        "id": 1,
        "full_name": "John Doe",
        "company": "Tech Corp",
        "checked_in_at": "2024-07-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### POST /api/stats/snapshot

Trigger manual stats snapshot (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "success": true,
  "snapshot": {
    "id": 1,
    "timestamp": "2024-07-15T10:00:00.000Z",
    "summary_text": "As of July 15, 2024..."
  }
}
```

**Errors:**
- `403`: Forbidden (Admin role required)

---

### POST /api/stats/search

Search historical stats (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "query": "check-in rate last week"
}
```

**Response (200):**
```json
{
  "success": true,
  "matches": [
    {
      "id": 1,
      "timestamp": "2024-07-15T10:00:00.000Z",
      "summary_text": "As of July 15, 2024...",
      "similarity": 0.95
    }
  ]
}
```

**Errors:**
- `403`: Forbidden (Admin role required)

---

### POST /api/stats/ask

Ask global AI assistant.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "question": "What's the total attendance?"
}
```

**Response (200):**
```json
{
  "success": true,
  "answer": "Based on the historical data, the total attendance across all events is 500 visitors."
}
```

---

## Public Endpoints

### GET /api/public/events

Get public events (no authentication required).

**Response (200):**
```json
{
  "success": true,
  "events": [
    {
      "id": 1,
      "name": "Tech Conference 2024",
      "date": "2024-07-15T09:00:00.000Z",
      "location": "Convention Center",
      "status": "active"
    }
  ]
}
```

---

### POST /api/public/register

Public visitor registration (no authentication required).

**Request Body:**
```json
{
  "event_id": 1,
  "full_name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "company": "Tech Corp"
}
```

**Response (201):**
```json
{
  "success": true,
  "visitor": {
    "id": 1,
    "full_name": "John Doe",
    "check_in_token": "TKN-ABC123"
  },
  "token": "TKN-ABC123"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Additional error details"]
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Swagger Documentation

Interactive API documentation available at:
- **Development**: http://localhost:5000/api-docs
- **Production**: https://your-backend-url.onrender.com/api-docs
