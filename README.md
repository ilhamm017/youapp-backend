# YouApp Backend API

A comprehensive NestJS backend application with MongoDB, Docker, JWT authentication, RabbitMQ messaging, and custom data structures showcasing OOP principles.

## 🚀 Features

- **Authentication**: JWT-based authentication with secure password hashing
- **User Profiles**: Complete CRUD operations with horoscope & Chinese zodiac calculations
- **Real-time Chat**: Message system with threading, RabbitMQ integration, and notifications
- **Custom Data Structures**: LinkedList, Queue, BST, Graph, and Heap implementations
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Docker Support**: Complete docker-compose setup with MongoDB and RabbitMQ
- **Validation**: Comprehensive DTO validation using class-validator
- **Best Practices**: Clean architecture, error handling, and logging

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd youapp-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Application
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=password123
MONGO_DATABASE=youapp
MONGODB_URI=mongodb://admin:password123@localhost:27017/youapp?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
QUEUE_MESSAGE=messages
QUEUE_NOTIFICATION=notifications
```

### 4. Start with Docker (Recommended)

Start all services (MongoDB, RabbitMQ, and the app):

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up -d
```

### 5. Start without Docker (Local Development)

**Terminal 1 - MongoDB**:
```bash
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:6.0
```

**Terminal 2 - RabbitMQ**:
```bash
docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq \
  rabbitmq:3-management-alpine
```

**Terminal 3 - Application**:
```bash
npm run start:dev
```

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api/docs
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register a new user | No |
| POST | `/api/login` | Login and get JWT token | No |

### User Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/createProfile` | Create/update user profile | Yes |
| GET | `/api/getProfile` | Get user profile | Yes |
| PUT | `/api/updateProfile` | Update profile | Yes |

### Chat

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/sendMessage` | Send a message | Yes |
| GET | `/api/viewMessages` | View messages with another user | Yes |
| GET | `/api/conversations` | Get all conversations | Yes |
| GET | `/api/unreadCount` | Get unread message count | Yes |

## 🎯 Usage Examples

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "Password123!"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "johndoe",
    "password": "Password123!"
  }'
```

### 3. Create Profile

```bash
curl -X POST http://localhost:3000/api/createProfile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "birthday": "1990-03-25",
    "gender": "Male",
    "height": 175,
    "weight": 70,
    "interests": ["coding", "music", "travel"]
  }'
```

### 4. Send Message

```bash
curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverId": "RECEIVER_USER_ID",
    "content": "Hello! How are you?"
  }'
```

## 🏗️ Architecture & Data Structures

### Custom Data Structures Implementation

1. **LinkedList** - Managing user interests
   - Insert, remove, find operations
   - O(1) insertion at tail
   - Used in profile management

2. **Queue** (Circular Buffer) - Unread message tracking
   - FIFO operations
   - Auto-resizing capability
   - Used for message notifications

3. **Binary Search Tree** - Message threading
   - In-order, pre-order, post-order traversals
   - Thread organization for nested replies
   - O(log n) search/insert

4. **Graph** (Adjacency List) - User relationships
   - BFS, DFS algorithms
   - Shortest path between users
   - Conversation network analysis

5. **Min-Heap** - Message priority queue  
   - Priority-based message handling
   - O(log n) insert/extract operations
   - Future feature for urgent messages

### Tech Stack

- **Framework**: NestJS 10.x
- **Database**: MongoDB 6.0
- **Message Queue**: RabbitMQ 3.x
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Runtime**: Node.js 18+
- **Container**: Docker & Docker Compose

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run test coverage:

```bash
npm run test:cov
```

## 📦 Project Structure

```
youapp-backend/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── guards/          # Route guards
│   │   ├── strategies/      # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                # Users & Profile module
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── utils/           # Horoscope & Zodiac calculators
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── chat/                 # Chat module
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── services/        # RabbitMQ service
│   │   ├── chat.controller.ts
│   │   ├── chat.service.ts
│   │   └── chat.module.ts
│   ├── shared/               # Shared utilities
│   │   ├── data-structures/ # Custom DS implementations
│   │   ├── decorators/
│   │   └── filters/
│   ├── config/               # Configuration files
│   ├── app.module.ts
│   └── main.ts
├── test/                     # E2E tests
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🔐 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- Input validation with class-validator
- Helmet.js for HTTP headers (production recommendation)
- CORS configuration
- Environment-based configuration

## 🌟 Key Features Highlights

### Horoscope & Zodiac Calculation

Automatic calculation based on birthday:
- **Horoscope**: Western astrology (Aries, Taurus, etc.)
- **Zodiac**: Chinese zodiac (Rat, Ox, Tiger, etc.)

### Message Threading

Support for threaded conversations:
- Reply to specific messages
- Organized in tree structure
- Efficient retrieval with BST

### RabbitMQ Integration

Asynchronous message processing:
- Message queue for scalability
- Notification system for real-time updates
- Pub/Sub pattern implementation

## 🚦 Health Checks

- MongoDB: `docker exec mongodb echo 'db.runCommand("ping").ok' | mongosh --quiet`
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- API Health: http://localhost:3000

## 📝 Development

Start in development mode with hot-reload:

```bash
npm run start:dev
```

Build for production:

```bash
npm run build
```

Start production build:

```bash
npm run start:prod
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB container is running:
   ```bash
   docker ps | grep mongodb
   ```

2. Check logs:
   ```bash
   docker logs mongodb
   ```

### RabbitMQ Connection Issues

1. Verify RabbitMQ is running:
   ```bash
   docker ps | grep rabbitmq
   ```

2. Access management UI:
   ```
   http://localhost:15672
   ```

### Application Won't Start

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check environment variables in `.env`

3. Restart Docker containers:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

## 📄 License

MIT

## 👥 Author

Built for YouApp technical assessment

## 🙏 Acknowledgments

- NestJS framework
- MongoDB database
- RabbitMQ message broker
- All open-source contributors
