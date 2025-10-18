# API Testing Guide

## Clean Architecture Structure

The backend API is built following Clean Architecture principles with clear separation of concerns:

```
FirstTryRequire/
├── Domain/                  # Business entities and interfaces (Core layer)
│   ├── Entities/
│   │   └── User.cs         # User entity with all properties
│   └── Interfaces/
│       └── IUserRepository.cs  # Repository interface
├── Application/             # Use cases and DTOs (Application layer)
│   ├── DTOs/
│   │   └── UserDto.cs      # Data Transfer Object for API responses
│   └── UseCases/
│       └── GetUserUseCase.cs   # Business logic for getting a user
├── Infrastructure/          # External concerns (Infrastructure layer)
│   ├── Data/
│   │   └── ApplicationDbContext.cs  # EF Core DbContext
│   └── Repositories/
│       └── UserRepository.cs        # MySQL repository implementation
└── API/                     # API endpoints (Presentation layer)
    └── Controllers/
        └── UsersController.cs       # REST API controller
```

## Architecture Benefits

- **Dependency Rule**: Dependencies point inward (API → Application → Domain)
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Easy to swap implementations (e.g., change from MySQL to PostgreSQL)

## Before Testing

### 1. Ensure MySQL is Running

Make sure your MySQL Docker container is running with the users table:

```bash
# Check if MySQL container is running
docker ps | grep mysql

# If not running, start it
docker-compose up mysql -d
```

### 2. Restore NuGet Packages

```bash
cd backend/FirstTryRequire
dotnet restore
```

### 3. Build the Application

```bash
dotnet build
```

## Running the API Locally

### Start the API

```bash
cd backend/FirstTryRequire
dotnet run
```

The API will start on:

- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000/swagger`

## API Endpoints

### Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Description:** Retrieves a user by their ID from the database

**Parameters:**

- `id` (path parameter, integer): The user ID

**Response Codes:**

- `200 OK`: User found and returned
- `404 Not Found`: User with the specified ID doesn't exist
- `500 Internal Server Error`: Server error occurred

**Success Response Example:**

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@firsttry.com",
  "createdAt": "2025-10-18T10:30:00",
  "updatedAt": "2025-10-18T10:30:00",
  "lastLogin": null,
  "manageLevel": "Admin"
}
```

**Error Response Example (404):**

```json
{
  "message": "User with ID 999 not found"
}
```

## Testing with cURL

### Test Get User (Existing User)

```bash
curl -X GET "http://localhost:5000/api/users/1" -H "accept: application/json"
```

### Test Get User (Non-existing User)

```bash
curl -X GET "http://localhost:5000/api/users/999" -H "accept: application/json"
```

## Testing with Swagger UI

1. Navigate to `http://localhost:5000/swagger`
2. Find the `GET /api/users/{id}` endpoint
3. Click "Try it out"
4. Enter a user ID (e.g., 1 or 2 from the initial database seed)
5. Click "Execute"
6. View the response below

## Testing with Postman

1. Create a new GET request
2. URL: `http://localhost:5000/api/users/1`
3. Click "Send"
4. View the response

## Database Connection

The API connects to MySQL using Entity Framework Core:

### Local Development

Connection string in `appsettings.json`:

```
Server=localhost;Port=3306;Database=firsttry_db;User=appuser;Password=apppassword;
```

### Docker Environment

Connection string in `appsettings.Docker.json`:

```
Server=mysql;Port=3306;Database=firsttry_db;User=appuser;Password=apppassword;
```

## Verifying Database Data

Check what users exist in your database:

```bash
# Connect to MySQL container
docker exec -it firsttry_mysql mysql -u appuser -p

# Enter password: apppassword

# Query users
USE firsttry_db;
SELECT id, username, email, manage_level FROM users;
```

Expected output from initial seed:

```
+----+-----------+---------------------+--------------+
| id | username  | email               | manage_level |
+----+-----------+---------------------+--------------+
|  1 | admin     | admin@firsttry.com  | Admin        |
|  2 | testuser  | test@firsttry.com   | Worker       |
+----+-----------+---------------------+--------------+
```

## Common Issues and Solutions

### Issue: "Unable to connect to MySQL"

**Solution:** Ensure MySQL Docker container is running and accessible on port 3306

### Issue: "User not found"

**Solution:** Check if the user exists in the database using the SQL query above

### Issue: "CORS error from frontend"

**Solution:** The API is configured to allow requests from `http://localhost:3000`. Check the CORS policy in `Program.cs`

### Issue: "Swagger UI not loading"

**Solution:** Make sure you're running in Development mode and accessing the correct URL

## Next Steps

Once you've verified the Get User API works:

1. **Add More Endpoints:** Create, Update, Delete users
2. **Add Authentication:** Implement JWT authentication
3. **Add Validation:** Use FluentValidation for request validation
4. **Add Logging:** Implement structured logging with Serilog
5. **Add Unit Tests:** Test use cases and repositories
6. **Add Integration Tests:** Test the full API flow

## Architecture Extension Examples

### Adding a New Endpoint (e.g., Create User)

1. **Domain Layer:** Already have `User` entity and `IUserRepository.CreateAsync`
2. **Application Layer:** Create `CreateUserUseCase.cs` and `CreateUserDto.cs`
3. **Infrastructure Layer:** Already have `UserRepository.CreateAsync` implementation
4. **API Layer:** Add `[HttpPost]` action in `UsersController`
5. **Program.cs:** Register `CreateUserUseCase` in DI container

This structure keeps your code organized and maintainable!
