# Backend Project Structure

## Complete File Tree

```
backend/
├── Dockerfile                          # Docker container configuration
├── .dockerignore                       # Files to exclude from Docker build
├── API_TESTING_GUIDE.md               # Detailed testing instructions
├── CLEAN_ARCHITECTURE_SUMMARY.md      # Architecture explanation
├── PROJECT_STRUCTURE.md               # This file
│
└── FirstTryRequire/                   # Main .NET project
    ├── FirstTryRequire.csproj         # Project file with dependencies
    ├── Program.cs                     # Application entry point & DI configuration
    ├── appsettings.json              # Local development configuration
    ├── appsettings.Docker.json       # Docker environment configuration
    ├── appsettings.Development.json  # Development-specific settings
    │
    ├── Domain/                        # 🎯 Core Business Logic (No dependencies)
    │   ├── Entities/
    │   │   └── User.cs               # User entity with all properties
    │   └── Interfaces/
    │       └── IUserRepository.cs    # Repository contract
    │
    ├── Application/                   # 📋 Use Cases & Business Rules
    │   ├── DTOs/
    │   │   └── UserDto.cs            # Data Transfer Object (API response)
    │   └── UseCases/
    │       └── GetUserUseCase.cs     # Get user business logic
    │
    ├── Infrastructure/                # 🔧 External Concerns & Implementations
    │   ├── Data/
    │   │   └── ApplicationDbContext.cs  # Entity Framework DbContext
    │   └── Repositories/
    │       └── UserRepository.cs     # MySQL repository implementation
    │
    └── API/                          # 🌐 HTTP Entry Points
        └── Controllers/
            └── UsersController.cs    # REST API endpoints
```

## Layer Responsibilities

### 1. Domain Layer (Core)

**Purpose:** Contains enterprise business rules and entities

**Files:**

- `User.cs` - Business entity representing a user

  - Properties: Id, Username, Email, PasswordHash, CreatedAt, UpdatedAt, LastLogin, ManageLevel
  - Enum: ManageLevel (Admin, Worker)

- `IUserRepository.cs` - Repository interface defining data access contracts
  - Methods: GetByIdAsync, GetByUsernameAsync, GetByEmailAsync, GetAllAsync, CreateAsync, UpdateAsync, DeleteAsync, ExistsAsync

**Dependencies:** NONE (This is the core - no external dependencies!)

**Key Principle:** Business entities should be plain C# objects with no framework dependencies

---

### 2. Application Layer (Use Cases)

**Purpose:** Contains application-specific business rules and orchestrates the flow of data

**Files:**

- `UserDto.cs` - Data Transfer Object

  - Excludes sensitive data (password_hash)
  - Converts enum to string for API responses
  - Clean separation between domain and presentation

- `GetUserUseCase.cs` - Use case for retrieving a user
  - Accepts: User ID (int)
  - Returns: UserDto or null
  - Logic: Fetch from repository → Map to DTO → Return

**Dependencies:** Domain Layer only

**Key Principle:** Use cases orchestrate the flow but don't contain persistence logic

---

### 3. Infrastructure Layer (Implementations)

**Purpose:** Implements interfaces and handles external concerns (database, APIs, etc.)

**Files:**

- `ApplicationDbContext.cs` - Entity Framework Core DbContext

  - Configures database connection
  - Maps C# entities to MySQL tables
  - Handles snake_case column naming
  - Configures indexes and constraints

- `UserRepository.cs` - Concrete implementation of IUserRepository
  - Uses Entity Framework Core for data access
  - Implements all CRUD operations
  - Async/await for better performance
  - Returns domain entities (not DTOs)

**Dependencies:** Domain Layer (implements its interfaces)

**Key Principle:** Infrastructure depends on abstractions (interfaces), not concrete implementations

---

### 4. API Layer (Presentation)

**Purpose:** Handles HTTP requests and responses

**Files:**

- `UsersController.cs` - REST API controller
  - Route: `/api/users`
  - Endpoints:
    - `GET /api/users/{id}` - Get user by ID
  - Uses dependency injection for use cases
  - Handles HTTP status codes (200, 404, 500)
  - Implements proper error handling
  - Includes logging for debugging

**Dependencies:** Application Layer (use cases)

**Key Principle:** Controllers should be thin - they delegate to use cases

---

### 5. Configuration (Entry Point)

**Purpose:** Wire everything together with dependency injection

**File:**

- `Program.cs` - Application startup
  - Configures services (DI container)
  - Registers DbContext with MySQL
  - Registers repositories (Infrastructure → Domain interfaces)
  - Registers use cases (Application layer)
  - Configures CORS for frontend
  - Configures Swagger/OpenAPI
  - Sets up middleware pipeline

**Configuration Files:**

- `appsettings.json` - Local development (Server=localhost)
- `appsettings.Docker.json` - Docker environment (Server=mysql)
- `appsettings.Development.json` - Development-specific overrides

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                   HTTP Request                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  API Layer                                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ UsersController                                    │  │
│  │ - Handles HTTP requests                           │  │
│  │ - Returns HTTP responses                          │  │
│  │ - Delegates to use cases                          │  │
│  └───────────────────┬───────────────────────────────┘  │
└────────────────────────┼───────────────────────────────┘
                        │ depends on
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Application Layer                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ GetUserUseCase                                     │  │
│  │ - Contains business logic                         │  │
│  │ - Maps entities to DTOs                           │  │
│  │ - Uses repository interface                       │  │
│  └───────────────────┬───────────────────────────────┘  │
└────────────────────────┼───────────────────────────────┘
                        │ depends on
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Domain Layer (CORE - No Dependencies!)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │ User Entity          │ IUserRepository (Interface)│  │
│  │ - Business rules     │ - Data access contract     │  │
│  │ - Domain logic       │ - No implementation        │  │
│  └──────────────────────┴────────────────────────────┘  │
└─────────────────────────▲───────────────────────────────┘
                         │ implements
                         │
┌────────────────────────┴────────────────────────────────┐
│  Infrastructure Layer                                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │ UserRepository (Implementation)                    │  │
│  │ - Implements IUserRepository                      │  │
│  │ - Uses Entity Framework Core                      │  │
│  │ - Talks to MySQL database                         │  │
│  └───────────────────┬───────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ ApplicationDbContext                              │  │
│  │ - EF Core DbContext                               │  │
│  │ - Configures database mapping                     │  │
│  └───────────────────┬───────────────────────────────┘  │
└────────────────────────┼───────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  MySQL DB     │
                │  firsttry_db  │
                └───────────────┘
```

## Request Flow Example

**User makes GET request:** `GET /api/users/1`

1. **API Layer** (`UsersController.GetUser`)

   - Receives HTTP request
   - Extracts ID from route parameter
   - Logs the request

2. **Application Layer** (`GetUserUseCase.ExecuteAsync`)

   - Receives ID from controller
   - Calls repository to fetch user
   - Maps User entity to UserDto
   - Returns DTO

3. **Domain Layer** (Interfaces)

   - `IUserRepository.GetByIdAsync` defines the contract

4. **Infrastructure Layer** (`UserRepository.GetByIdAsync`)

   - Executes SQL query via Entity Framework
   - Returns User entity or null

5. **Back to Application Layer**

   - Receives User entity
   - Maps to UserDto
   - Returns to controller

6. **Back to API Layer**
   - Receives UserDto
   - Converts to HTTP response (JSON)
   - Returns 200 OK with JSON data

## Key Files Explained

### Program.cs - Dependency Injection Setup

```csharp
// Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(...)

// Register Repository (Infrastructure → Domain interface)
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register Use Case (Application layer)
builder.Services.AddScoped<GetUserUseCase>();
```

**Flow:**

- Controller requests `GetUserUseCase`
- DI container injects `GetUserUseCase`
- `GetUserUseCase` requests `IUserRepository`
- DI container injects `UserRepository` implementation
- `UserRepository` requests `ApplicationDbContext`
- DI container injects `ApplicationDbContext`

### ApplicationDbContext.cs - Database Mapping

Maps C# properties to database columns:

- `Id` (C#) → `id` (MySQL)
- `Username` (C#) → `username` (MySQL)
- `ManageLevel` enum → string in database

### GetUserUseCase.cs - Business Logic

```csharp
1. Receive user ID
2. Call repository.GetByIdAsync(id)
3. If null → return null
4. Map User entity to UserDto
5. Return DTO
```

## Why This Structure?

### ✅ Benefits

1. **Testability**

   - Mock interfaces for unit testing
   - Test each layer independently

2. **Maintainability**

   - Clear separation of concerns
   - Easy to locate code
   - Changes in one layer don't affect others

3. **Flexibility**

   - Easy to swap implementations
   - Can change from MySQL to PostgreSQL by only changing Infrastructure

4. **Scalability**

   - Add new features following the same pattern
   - Multiple developers can work on different layers

5. **Domain-Centric**
   - Business logic is protected in Domain layer
   - No framework dependencies in core business rules

### 🔄 Comparison with Other Architectures

**Traditional Layered Architecture:**

- UI → Business Logic → Data Access
- Often leads to tight coupling
- Database changes affect everything

**Clean Architecture:**

- Dependencies point inward
- Domain is independent
- Easy to test and maintain

## Adding New Features

### Example: Add "Create User" Endpoint

1. **Domain Layer**: Interface already exists (`IUserRepository.CreateAsync`)

2. **Application Layer**:

   ```
   Application/DTOs/CreateUserRequest.cs
   Application/UseCases/CreateUserUseCase.cs
   ```

3. **Infrastructure Layer**: Implementation already exists

4. **API Layer**:

   ```csharp
   [HttpPost]
   public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
   ```

5. **Program.cs**: Register `CreateUserUseCase`

That's it! Clear and organized.

## Summary

✅ **Domain**: Core business entities and rules (User, IUserRepository)
✅ **Application**: Use cases and DTOs (GetUserUseCase, UserDto)
✅ **Infrastructure**: Database and external services (DbContext, UserRepository)
✅ **API**: HTTP endpoints (UsersController)
✅ **Configuration**: Dependency injection (Program.cs)

This structure keeps your code clean, testable, and maintainable! 🎯
