# Setup Instructions

Complete setup guide for the Smart Event Check-in System.

## Prerequisites

- **Node.js**: v18 or higher
- **MySQL**: 8.0 or higher
- **pnpm**: Recommended package manager (or npm)
- **Git**: For cloning the repository

## Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd lahn-event-management
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE smart_event_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
pnpm install
```

Create environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_event_db
DB_USER=root
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key
VOYAGE_API_KEY=your-voyage-api-key

# Email Configuration (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM_NAME=Smart Event System
SMTP_FROM_EMAIL=noreply@example.com

# Frontend URL (for activation links)
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
pnpm run dev
```

The backend will run on `http://localhost:5000`

### 4. Seed Database (Optional)

To populate the database with test data:

```bash
pnpm run seed
```

This creates:
- Admin user: `admin@lahn.test` / `password123`
- Staff user: `staff@lahn.test` / `password123`
- Sample events and visitors

### 5. Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
pnpm install
```

Create environment file:

```bash
# Create .env file in client directory
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

Start the frontend development server:

```bash
pnpm run dev
```

The frontend will run on `http://localhost:5173`

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Swagger Documentation**: http://localhost:5000/api-docs

## Production Deployment

### Render Deployment

#### Backend Service

**Build Command:**
```bash
cd server && pnpm install --frozen-lockfile && pnpm run build
```

**Start Command:**
```bash
cd server && pnpm run start
```

**Environment Variables:**
```env
NODE_ENV=production
PORT=5000
API_URL=https://your-backend-url.onrender.com
DB_HOST=your-mysql-host
DB_PORT=3306
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-key
VOYAGE_API_KEY=your-voyage-key
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
CLIENT_URL=https://your-frontend-url.onrender.com
```

#### Frontend Service (Vercel)

**Build Command:**
```bash
cd client && pnpm install --frozen-lockfile && pnpm run build
```

**Output Directory:**
```
dist
```

**Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Docker Deployment

1. Ensure Docker and Docker Compose are installed
2. Create `.env` file in root directory
3. Run:

```bash
docker-compose up -d --build
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Ensure database exists: `CREATE DATABASE smart_event_db;`

### Port Already in Use

If port 5000 is already in use:
- Change PORT in `.env` file
- Or stop the process using port 5000

### CORS Errors

If you get CORS errors:
- Verify FRONTEND_URL in backend `.env` matches your frontend URL
- Check CORS configuration in `server/src/app.ts`

### AI Not Working

If AI features don't work:
- Verify GEMINI_API_KEY is set in `.env`
- Check VOYAGE_API_KEY for global AI queries
- Ensure you have internet connectivity

### Email Not Sending

If emails don't send:
- Verify SMTP credentials in `.env`
- Check SMTP_HOST and SMTP_PORT
- For Gmail, use App Password instead of regular password
- Check firewall/network settings

## Development Commands

### Backend

```bash
pnpm run dev          # Start development server with hot-reload
pnpm run build        # Compile TypeScript to JavaScript
pnpm run start        # Start production server
pnpm run seed         # Seed database with test data
```

### Frontend

```bash
pnpm run dev          # Start development server with hot-reload
pnpm run build        # Build for production
pnpm run preview      # Preview production build
```

## Additional Resources

- [API Documentation](API.md)
- [AI Implementation Guide](AI_IMPLEMENTATION.md)
- [System Documentation](SYSTEM_DOCUMENTATION.md)
