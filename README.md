# FirstTryRequire Project

A full-stack web application built with **Next.js** frontend, **.NET 8** backend (Clean Architecture), and **MySQL** database, all containerized with Docker.

## ✨ Features

- 🎯 **Clean Architecture** backend following SOLID principles
- ⚛️ **Next.js** (React) frontend with TypeScript
- 🗄️ **MySQL** database with Entity Framework Core
- 🐳 **Docker** containerization for easy deployment
- 📚 **Swagger/OpenAPI** documentation
- 🔐 **CORS** configured for frontend-backend communication
- 📝 **Logging** with structured logs

## 🚀 Current API Endpoints

- `GET /api/users/{id}` - Retrieve a user by ID

## Project Structure

```
FirstTryRequire/
├── docker-compose.yml          # Docker Compose configuration
├── frontend/                   # React frontend application
│   ├── Dockerfile             # Frontend Docker configuration
│   └── .dockerignore          # Frontend Docker ignore file
├── backend/                   # .NET 8 backend API
│   ├── Dockerfile             # Backend Docker configuration
│   └── .dockerignore          # Backend Docker ignore file
├── database/                  # Database initialization scripts
│   └── init/
│       └── 01-init.sql        # MySQL initialization script
└── README.md                  # This file
```

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd FirstTryRequire
```

### 2. Applications Already Created!

✅ **Frontend:** Next.js application in `frontend/first-work-item/`
✅ **Backend:** .NET 8 Web API with Clean Architecture in `backend/FirstTryRequire/`
✅ **Database:** MySQL with sample users table

### 3. Start All Services

```bash
docker-compose up --build
```

This will:

- Start MySQL database on port 3306
- Start .NET 8 backend API on ports 5000 (HTTP) and 5001 (HTTPS)
- Start React frontend on port 3000

## Services

### MySQL Database

- **Port**: 3306
- **Database**: firsttry_db
- **Username**: appuser
- **Password**: apppassword
- **Root Password**: rootpassword

### .NET 8 Backend API

- **HTTP Port**: 5000
- **HTTPS Port**: 5001
- **Environment**: Development
- **Database Connection**: Automatically configured to connect to MySQL container

### React Frontend

- **Port**: 3000
- **API URL**: http://localhost:5000 (configured via REACT_APP_API_URL)

## Docker Commands

### Start all services

```bash
docker-compose up
```

### Start all services in detached mode

```bash
docker-compose up -d
```

### Rebuild and start all services

```bash
docker-compose up --build
```

### Stop all services

```bash
docker-compose down
```

### Stop all services and remove volumes

```bash
docker-compose down -v
```

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### Access containers

```bash
# Backend container
docker-compose exec backend bash

# Frontend container
docker-compose exec frontend sh

# MySQL container
docker-compose exec mysql mysql -u appuser -p firsttry_db
```

## Database Connection

Your .NET backend can connect to MySQL using this connection string:

```
Server=mysql;Database=firsttry_db;User=appuser;Password=apppassword;Port=3306;
```

The database will be automatically initialized with sample tables and data from the `database/init/01-init.sql` script.

## Development Workflow

1. **First Time Setup**: Run `docker-compose up --build` to create and start all containers
2. **Daily Development**: Run `docker-compose up` to start all services
3. **Code Changes**: The React frontend supports hot reloading. Backend changes require rebuilding the container
4. **Database Changes**: Modify `database/init/01-init.sql` and restart with `docker-compose down && docker-compose up --build`

## Troubleshooting

### Port Conflicts

If you have port conflicts, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Change 3000 to 3001 for frontend
  - "5002:5000" # Change 5000 to 5002 for backend
```

### Database Connection Issues

- Ensure MySQL container is running: `docker-compose ps`
- Check MySQL logs: `docker-compose logs mysql`
- Verify connection string in your .NET app matches the environment variables

### Frontend Not Loading

- Check if backend is running: `docker-compose logs backend`
- Verify REACT_APP_API_URL environment variable
- Check browser console for CORS errors

### Backend Build Issues

- Ensure your .NET project builds locally first
- Check Dockerfile for correct project name
- Verify all dependencies are included in .csproj file

## Environment Variables

You can customize the setup by creating a `.env` file in the root directory:

```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
REACT_APP_API_URL=http://localhost:5000
```

## Testing the Backend API

### Quick Test (Local Development)

1. **Start MySQL:**

   ```bash
   docker-compose up mysql -d
   ```

2. **Run Backend API:**

   ```bash
   cd backend/FirstTryRequire
   dotnet run
   ```

3. **Test with Swagger:**

   - Open browser: `http://localhost:5000/swagger`
   - Try GET `/api/users/1`

4. **Test with cURL:**
   ```bash
   curl http://localhost:5000/api/users/1
   ```

### Documentation

- 📖 **[Quick Start Testing Guide](QUICK_START_TESTING.md)** - Step-by-step testing instructions
- 🏗️ **[Clean Architecture Summary](backend/CLEAN_ARCHITECTURE_SUMMARY.md)** - Architecture explanation
- 📚 **[API Testing Guide](backend/API_TESTING_GUIDE.md)** - Detailed API documentation
- 🗂️ **[Project Structure](backend/PROJECT_STRUCTURE.md)** - Code organization

## Backend Architecture

The backend follows **Clean Architecture** with 4 layers:

1. **Domain Layer** - Core business entities (User, IUserRepository)
2. **Application Layer** - Use cases and DTOs (GetUserUseCase, UserDto)
3. **Infrastructure Layer** - Database implementation (EF Core, UserRepository)
4. **API Layer** - HTTP endpoints (UsersController)

### Benefits:

- ✅ Testable - Each layer can be tested independently
- ✅ Maintainable - Clear separation of concerns
- ✅ Flexible - Easy to swap implementations
- ✅ Scalable - Simple to add new features

## Next Steps

1. ✅ Test the GET user API endpoint
2. 📝 Add more CRUD endpoints (POST, PUT, DELETE)
3. 🔐 Implement authentication (JWT)
4. ✅ Create frontend components to consume the API
5. 🧪 Add unit and integration tests
6. 🚀 Deploy to production

## Support

For issues with this Docker setup, check:

- Docker Desktop is running
- No port conflicts with existing applications
- Sufficient disk space and memory allocated to Docker
- Firewall settings allowing Docker traffic
