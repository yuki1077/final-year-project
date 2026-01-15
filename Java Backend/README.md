# EduConnect Java Backend

A Spring Boot REST API implementation for the EduConnect platform, demonstrating professional MVC architecture and best practices.

## 🏗️ Architecture

This project follows the **MVC (Model-View-Controller)** pattern with clear separation of concerns:

```
src/main/java/com/educonnect/
├── models/           # Entity classes (JPA)
├── repositories/     # Data access layer (Spring Data JPA)
├── services/         # Business logic layer
├── controllers/      # REST API endpoints
├── dto/              # Data Transfer Objects
├── security/         # JWT & Spring Security
├── config/           # Configuration classes
├── exceptions/       # Custom exceptions & handlers
└── EduConnectApplication.java
```

---

## 🚀 Technologies Used

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** - Database operations
- **Spring Security** - Authentication & Authorization
- **JWT (JSON Web Tokens)** - Stateless authentication
- **MySQL** - Database
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool
- **Bean Validation** - Input validation

---

## 📦 Features Implemented

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, PUBLISHER, SCHOOL)
- Password encryption with BCrypt
- Custom UserDetailsService

### ✅ User Management
- User registration (Publisher, School)
- User approval system
- Profile management
- Get all users (Admin only)
- Publisher listing (public & authenticated)

### ✅ Book Management
- Create, Read, Update, Delete books
- Publisher-specific book listing
- Book search functionality
- ISBN uniqueness validation

### ✅ Order Management (Basic)
- Order creation (Schools)
- Order status updates
- Order listing by role

### ✅ Security Features
- JWT token generation & validation
- Role-based method security
- CORS configuration
- Global exception handling

---

## 🔧 Setup & Installation

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### 1. Clone & Navigate
```bash
cd "Java Backend"
```

### 2. Configure Database
Create MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS EduConnect;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/EduConnect
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Configure JWT Secret
Update in `application.properties`:
```properties
jwt.secret=your-very-long-and-secure-secret-key-here
jwt.expiration=86400000
```

### 4. Build & Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will start on: `http://localhost:8080/api`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/{id}` | Get user by ID | Admin |
| GET | `/api/users/publishers` | Get approved publishers | Admin/School |
| GET | `/api/users/publishers/public` | Get approved publishers | Public |
| PATCH | `/api/users/{id}/status` | Update user status | Admin |
| POST | `/api/users/{id}/profile-image` | Update profile image | Authenticated |

### Books
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get all books | Public |
| GET | `/api/books/{id}` | Get book by ID | Public |
| GET | `/api/books/search?keyword=` | Search books | Public |
| POST | `/api/books` | Create new book | Publisher/Admin |
| PUT | `/api/books/{id}` | Update book | Publisher/Admin |
| DELETE | `/api/books/{id}` | Delete book | Admin |
| GET | `/api/books/publisher/{id}` | Get publisher books | Publisher/Admin |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get orders | Authenticated |
| POST | `/api/orders` | Create order | School |
| PATCH | `/api/orders/{id}/status` | Update order status | Admin/Publisher |

---

## 🔒 Security

### JWT Token Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Example: Register & Login
**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Publisher",
    "email": "publisher@test.com",
    "password": "password123",
    "role": "PUBLISHER",
    "organizationName": "Test Org"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "publisher@test.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": 1,
      "name": "Test Publisher",
      "email": "publisher@test.com",
      "role": "PUBLISHER",
      "status": "PENDING"
    }
  }
}
```

---

## 📝 Code Structure Highlights

### Model (Entity)
```java
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    @Email
    private String email;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    // ... other fields
}
```

### Repository
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
}
```

### Service
```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    public UserDTO createUser(RegisterRequest request) {
        // Business logic
    }
}
```

### Controller
```java
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        // Controller logic
    }
}
```

---

## 🧪 Testing

Run tests:
```bash
mvn test
```

---

## 📊 Database Schema

The application uses JPA to auto-generate tables based on entities:
- `users` - User accounts
- `books` - Book catalog
- `orders` - Order records
- `order_items` - Order line items

---

## 🎯 Design Patterns Used

1. **MVC Pattern** - Separation of Model, View (REST), Controller
2. **Repository Pattern** - Data access abstraction
3. **Service Layer Pattern** - Business logic separation
4. **DTO Pattern** - Data transfer objects
5. **Dependency Injection** - Spring's IoC container
6. **Builder Pattern** - JWT token creation
7. **Strategy Pattern** - Authentication strategies

---

## 🔄 Comparison with Node.js Backend

| Feature | Java Spring Boot | Node.js Express |
|---------|-----------------|-----------------|
| Architecture | MVC with Layers | MVC with Layers |
| ORM | Spring Data JPA | Sequelize / Raw SQL |
| Validation | Bean Validation | express-validator |
| Security | Spring Security + JWT | Passport.js + JWT |
| DI | Built-in | Manual / Libraries |
| Type Safety | Strong (Java) | Weak (JavaScript) |
| Performance | High (JVM) | High (V8) |

---

## 🚧 Future Enhancements

- [ ] Complete Order Service implementation
- [ ] Add pagination for list endpoints
- [ ] Implement file upload (Cloudinary)
- [ ] Add email notification service
- [ ] Implement caching (Redis)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit & integration tests
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Dockerize the application

---

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/index.html)
- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [JWT.io](https://jwt.io/)

---

## 🤝 Contributing

This is a demonstration project. Feel free to use it as a reference or starting point for your own projects.

---

## 📄 License

This project is for educational purposes.

---

**Note:** This Java backend is a parallel implementation for demonstration purposes. The main application uses the Node.js backend located in the `server/` directory.





