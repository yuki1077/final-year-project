# EduConnect Java Backend - Project Structure

## 📁 Complete File Structure

```
Java Backend/
├── pom.xml                                          # Maven configuration
├── README.md                                        # Project documentation
├── PROJECT_STRUCTURE.md                             # This file
├── .gitignore                                       # Git ignore rules
│
├── src/main/
│   ├── java/com/educonnect/
│   │   ├── EduConnectApplication.java              # Main Spring Boot application
│   │   │
│   │   ├── config/                                 # Configuration classes
│   │   │   ├── SecurityConfig.java                 # Spring Security setup
│   │   │   └── WebConfig.java                      # CORS & Web configuration
│   │   │
│   │   ├── controllers/                            # REST API Controllers
│   │   │   ├── AuthController.java                 # /api/auth/* endpoints
│   │   │   ├── UserController.java                 # /api/users/* endpoints
│   │   │   ├── BookController.java                 # /api/books/* endpoints
│   │   │   └── OrderController.java                # /api/orders/* endpoints
│   │   │
│   │   ├── dto/                                    # Data Transfer Objects
│   │   │   ├── ApiResponse.java                    # Standardized API response
│   │   │   ├── LoginRequest.java                   # Login payload
│   │   │   ├── RegisterRequest.java                # Registration payload
│   │   │   ├── AuthResponse.java                   # Auth response (token + user)
│   │   │   ├── UserDTO.java                        # User data transfer
│   │   │   ├── BookDTO.java                        # Book data transfer
│   │   │   └── CreateBookRequest.java              # Book creation payload
│   │   │
│   │   ├── exceptions/                             # Exception handling
│   │   │   ├── ResourceNotFoundException.java      # 404 exception
│   │   │   └── GlobalExceptionHandler.java         # Global error handler
│   │   │
│   │   ├── models/                                 # JPA Entities (Database models)
│   │   │   ├── User.java                           # User entity
│   │   │   ├── Book.java                           # Book entity
│   │   │   ├── Order.java                          # Order entity
│   │   │   └── OrderItem.java                      # Order items entity
│   │   │
│   │   ├── repositories/                           # Data Access Layer
│   │   │   ├── UserRepository.java                 # User database operations
│   │   │   ├── BookRepository.java                 # Book database operations
│   │   │   ├── OrderRepository.java                # Order database operations
│   │   │   └── OrderItemRepository.java            # Order items operations
│   │   │
│   │   ├── security/                               # Security & JWT
│   │   │   ├── JwtTokenProvider.java               # JWT generation & validation
│   │   │   ├── JwtAuthenticationFilter.java        # JWT request filter
│   │   │   └── CustomUserDetailsService.java       # User authentication service
│   │   │
│   │   └── services/                               # Business Logic Layer
│   │       ├── AuthService.java                    # Authentication logic
│   │       ├── UserService.java                    # User business logic
│   │       └── BookService.java                    # Book business logic
│   │
│   └── resources/
│       └── application.properties                   # Application configuration
│
└── src/test/java/com/educonnect/                   # Test classes (placeholder)
```

---

## 🎯 Layer Architecture

### 1. **Controller Layer** (REST API)
- Handles HTTP requests/responses
- Input validation
- Calls service layer
- Returns formatted responses

### 2. **Service Layer** (Business Logic)
- Core business operations
- Transaction management
- Calls repository layer
- Maps entities to DTOs

### 3. **Repository Layer** (Data Access)
- Database operations
- Spring Data JPA interfaces
- Custom queries
- CRUD operations

### 4. **Model Layer** (Entities)
- Database table mappings
- JPA annotations
- Relationships
- Validation rules

---

## 📊 Key Components

### Models (Entities)
| File | Description | Key Fields |
|------|-------------|------------|
| `User.java` | User accounts | id, name, email, role, status |
| `Book.java` | Book catalog | id, title, author, isbn, price |
| `Order.java` | Order records | id, schoolId, total, status |
| `OrderItem.java` | Order line items | id, orderId, bookId, quantity |

### Repositories (Queries)
| File | Key Methods | Purpose |
|------|-------------|---------|
| `UserRepository` | findByEmail, findByRole | User queries |
| `BookRepository` | findByPublisherId, searchBooks | Book queries |
| `OrderRepository` | findBySchoolId, findOrdersByPublisherId | Order queries |

### Services (Business Logic)
| File | Key Methods | Purpose |
|------|-------------|---------|
| `AuthService` | register, login | Authentication |
| `UserService` | createUser, updateStatus | User management |
| `BookService` | createBook, updateBook | Book management |

### Controllers (APIs)
| File | Base URL | Key Endpoints |
|------|----------|---------------|
| `AuthController` | `/api/auth` | /register, /login |
| `UserController` | `/api/users` | GET /, GET /{id}, PATCH /{id}/status |
| `BookController` | `/api/books` | GET /, POST /, PUT /{id}, DELETE /{id} |
| `OrderController` | `/api/orders` | GET /, POST /, PATCH /{id}/status |

---

## 🔐 Security Flow

```
Client Request
     ↓
JWT Filter (JwtAuthenticationFilter)
     ↓
Token Validation (JwtTokenProvider)
     ↓
Load User (CustomUserDetailsService)
     ↓
Check Roles (SecurityConfig)
     ↓
Controller → Service → Repository → Database
     ↓
Response to Client
```

---

## 🔄 Request Flow Example

**Creating a Book (POST /api/books)**

1. **Client** sends request with JWT token
2. **JwtAuthenticationFilter** validates token
3. **BookController** receives request
   - Validates input (@Valid)
   - Checks authorization (@PreAuthorize)
4. **BookService** executes business logic
   - Checks ISBN uniqueness
   - Maps DTO to Entity
5. **BookRepository** saves to database
6. **Response** returns BookDTO to client

---

## 📦 Dependencies (pom.xml)

### Core Spring Boot
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation

### Database
- mysql-connector-j

### Security
- jjwt-api, jjwt-impl, jjwt-jackson (JWT)

### Utilities
- lombok (reduces boilerplate)
- commons-lang3

### Email
- spring-boot-starter-mail

---

## 🚀 How to Run

1. **Setup Database:**
   ```sql
   CREATE DATABASE EduConnect;
   ```

2. **Configure application.properties:**
   - Database credentials
   - JWT secret
   - Email settings (optional)

3. **Build & Run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Test API:**
   ```bash
   curl http://localhost:8080/api/books
   ```

---

## 📝 Code Conventions

- **Naming:**
  - Classes: PascalCase (UserService.java)
  - Methods: camelCase (getUserById)
  - Constants: UPPER_SNAKE_CASE
  
- **Annotations:**
  - `@Service` - Service layer
  - `@Repository` - Data access layer
  - `@RestController` - REST endpoints
  - `@Entity` - Database entities
  
- **Package Structure:**
  - controllers → HTTP layer
  - services → Business logic
  - repositories → Data access
  - models → Database entities
  - dto → Data transfer

---

## 🎓 Learning Points

This project demonstrates:

1. ✅ **MVC Architecture** - Clear separation of concerns
2. ✅ **Dependency Injection** - Spring IoC container
3. ✅ **JPA/Hibernate** - Object-relational mapping
4. ✅ **RESTful APIs** - Standard HTTP methods
5. ✅ **JWT Authentication** - Stateless security
6. ✅ **Role-Based Access Control** - Authorization
7. ✅ **Exception Handling** - Global error management
8. ✅ **DTO Pattern** - Data encapsulation
9. ✅ **Repository Pattern** - Data abstraction
10. ✅ **Bean Validation** - Input validation

---

## 📊 Files Count

- **Total Java Files:** 28
- **Controllers:** 4
- **Services:** 3
- **Repositories:** 4
- **Models:** 4
- **DTOs:** 7
- **Security:** 3
- **Config:** 2
- **Exceptions:** 2

---

## 🔗 Related Documentation

- Main Project: `../README.md`
- Java Backend: `./README.md`
- Email Setup: `../EMAIL_SETUP.md`
- Superadmin: `../SUPERADMIN_SETUP.md`





