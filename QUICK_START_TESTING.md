# Quick Start: Testing Your Get User API

## Prerequisites Checklist

- ✅ MySQL Docker container running
- ✅ Users table created and seeded with data
- ✅ .NET 8 SDK installed
- ✅ Backend code created with Clean Architecture

## Step-by-Step Testing Guide

### Step 1: Ensure MySQL is Running

```bash
# Check if MySQL container is running
docker ps

# If not running, start MySQL only
docker-compose up mysql -d

# Wait a few seconds for MySQL to initialize
sleep 5
```

### Step 2: Verify Database Has Users

```bash
# Connect to MySQL
docker exec -it firsttry_mysql mysql -u appuser -p
# Password: apppassword

# Run these SQL commands:
USE firsttry_db;
SELECT * FROM users;
exit;
```

Expected output:

```
+----+-----------+---------------------+------------------+---------------------+---------------------+------------+--------------+
| id | username  | email               | password_hash    | created_at          | updated_at          | last_login | manage_level |
+----+-----------+---------------------+------------------+---------------------+---------------------+------------+--------------+
|  1 | admin     | admin@firsttry.com  | hashedpassword123| 2025-10-18 10:30:00 | 2025-10-18 10:30:00 | NULL       | Admin        |
|  2 | testuser  | test@firsttry.com   | hashedpassword456| 2025-10-18 10:30:00 | 2025-10-18 10:30:00 | NULL       | Worker       |
+----+-----------+---------------------+------------------+---------------------+---------------------+------------+--------------+
```

### Step 3: Run the Backend API

```bash
# Navigate to backend directory
cd backend/FirstTryRequire

# Restore packages (first time only)
dotnet restore

# Run the application
dotnet run
```

You should see output like:

```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### Step 4: Test with Swagger UI (Easiest Method)

1. Open your browser
2. Navigate to: `http://localhost:5000/swagger`
3. You should see the Swagger UI with your API documentation
4. Find the `GET /api/users/{id}` endpoint
5. Click **"Try it out"**
6. Enter `1` in the `id` field
7. Click **"Execute"**
8. Check the response:

**Expected Success Response (200):**

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

9. Try with `id` = `2` to get the testuser
10. Try with `id` = `999` to test the not found case

**Expected Not Found Response (404):**

```json
{
  "message": "User with ID 999 not found"
}
```

### Step 5: Test with cURL (Command Line)

Open a new terminal (keep the API running) and run:

```bash
# Test getting user with ID 1
curl -X GET "http://localhost:5000/api/users/1" -H "accept: application/json"

# Test getting user with ID 2
curl -X GET "http://localhost:5000/api/users/2" -H "accept: application/json"

# Test non-existing user
curl -X GET "http://localhost:5000/api/users/999" -H "accept: application/json"
```

### Step 6: Test with Browser

Simply open your browser and navigate to:

- `http://localhost:5000/api/users/1`
- `http://localhost:5000/api/users/2`

The JSON response should display directly in the browser.

### Step 7: Check the Logs

Back in the terminal where the API is running, you should see logs like:

```
info: FirstTryRequire.API.Controllers.UsersController[0]
      Getting user with ID: 1
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (123ms) [Parameters=[@__id_0='1'], CommandType='Text', CommandTimeout='30']
      SELECT `u`.`id`, `u`.`username`, `u`.`email`, ...
info: FirstTryRequire.API.Controllers.UsersController[0]
      Successfully retrieved user with ID: 1
```

## Troubleshooting

### Issue: "Unable to connect to the database"

**Check 1:** Is MySQL running?

```bash
docker ps | grep mysql
```

**Check 2:** Is the connection string correct?

```bash
cat backend/FirstTryRequire/appsettings.json | grep ConnectionString
```

**Check 3:** Can you connect to MySQL directly?

```bash
mysql -h 127.0.0.1 -P 3306 -u appuser -p firsttry_db
```

### Issue: "dotnet command not found"

Install .NET 8 SDK:

- macOS: `brew install dotnet-sdk`
- Windows: Download from https://dotnet.microsoft.com/download
- Linux: Follow instructions at https://docs.microsoft.com/en-us/dotnet/core/install/linux

### Issue: "Port 5000 already in use"

Find and kill the process:

```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "User not found" for ID 1 or 2

Re-run the database initialization:

```bash
docker exec -i firsttry_mysql mysql -u appuser -p apppassword firsttry_db < database/init/01-init.sql
```

### Issue: Package restore fails

Try clearing the NuGet cache:

```bash
dotnet nuget locals all --clear
dotnet restore
```

## Success Indicators

✅ Swagger UI loads at http://localhost:5000/swagger
✅ GET /api/users/1 returns user data
✅ GET /api/users/2 returns different user data
✅ GET /api/users/999 returns 404 error
✅ Console shows informational logs
✅ No error messages in console

## What You've Accomplished

🎉 **Congratulations!** You've successfully:

1. ✅ Built a Clean Architecture backend API
2. ✅ Connected to MySQL database
3. ✅ Implemented proper separation of concerns
4. ✅ Created a working REST API endpoint
5. ✅ Set up proper error handling
6. ✅ Added API documentation with Swagger
7. ✅ Implemented logging
8. ✅ Configured CORS for frontend integration

## Next Testing Steps

### 1. Test from Your Next.js Frontend

Create a simple API call in your Next.js app:

```typescript
// In your Next.js component
const getUser = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
```

### 2. Test with Postman

1. Download Postman
2. Create new GET request
3. URL: `http://localhost:5000/api/users/1`
4. Click Send
5. View response

### 3. Add More Endpoints

Now that Get User works, you can add:

- POST /api/users - Create a new user
- PUT /api/users/{id} - Update a user
- DELETE /api/users/{id} - Delete a user
- GET /api/users - Get all users

## Architecture Reminder

Your API follows Clean Architecture:

```
┌─────────────────────────────────────┐
│     API Layer (Controllers)         │  ← HTTP Requests
├─────────────────────────────────────┤
│  Application Layer (Use Cases)      │  ← Business Logic
├─────────────────────────────────────┤
│   Domain Layer (Entities)           │  ← Core Business Rules
├─────────────────────────────────────┤
│ Infrastructure (DB/Repositories)    │  ← Data Access
└─────────────────────────────────────┘
            ↓
        MySQL Database
```

Each layer has a specific responsibility and doesn't depend on outer layers!

## Documentation

For more details, see:

- `backend/API_TESTING_GUIDE.md` - Detailed API testing guide
- `backend/CLEAN_ARCHITECTURE_SUMMARY.md` - Architecture explanation
- `README.md` - Project overview and Docker setup

Happy coding! 🚀
