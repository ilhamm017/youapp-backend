# 🚀 Quick Start - Menjalankan Aplikasi

Panduan cepat untuk menjalankan YouApp Backend di WSL Ubuntu dengan Podman.

---

## ⚡ Cara Tercepat (1 Command)

```bash
cd /home/alice/GBCI_Ventures_test/youapp-backend
bash setup-podman.sh
```

Script otomatis akan:
1. ✅ Install Podman
2. ✅ Install podman-compose
3. ✅ Setup PATH
4. ✅ Verify installation

**Setelah selesai:**
```bash
source ~/.bashrc
podman-compose up -d --build
```

---

## 📋 Manual Installation (Step by Step)

Jika prefer install manual:

### Step 1: Install Podman
```bash
sudo apt-get update
sudo apt-get install -y podman
podman --version
```

### Step 2: Install podman-compose
```bash
sudo apt-get install -y python3-pip
pip3 install podman-compose --user

# Add to PATH
echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Verify Installation
```bash
podman --version
podman-compose --version
```

---

## 🎯 Menjalankan Aplikasi

### Method 1: Podman Compose (Recommended)

```bash
cd /home/alice/GBCI_Ventures_test/youapp-backend

# Build and run in background
podman-compose up -d --build

# View logs
podman-compose logs -f

# Stop
podman-compose down
```

### Method 2: Podman Native (Manual)

```bash
# Create network
podman network create youapp-network

# Run MongoDB
podman run -d \
  --name youapp-mongodb \
  --network youapp-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:6.0

# Run RabbitMQ
podman run -d \
  --name youapp-rabbitmq \
  --network youapp-network \
  -p 5672:5672 \
  -p 15672:15672 \
  -v rabbitmq_data:/var/lib/rabbitmq \
  rabbitmq:3-management-alpine

# Build and run NestJS app
podman build -t youapp-backend .
podman run -d \
  --name youapp-api \
  --network youapp-network \
  -p 3000:3000 \
  --env-file .env \
  youapp-backend
```

---

## ✅ Verifikasi Aplikasi Berjalan

### 1. Check Containers
```bash
podman ps
```

**Expected output:**
```
CONTAINER ID  IMAGE                         STATUS      PORTS
xxxxx         mongo:6.0                     Up          0.0.0.0:27017->27017/tcp
xxxxx         rabbitmq:3-management-alpine  Up          0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
xxxxx         youapp-backend                Up          0.0.0.0:3000->3000/tcp
```

### 2. Test API
```bash
curl http://localhost:3000
```

**Expected response:**
```json
{"message":"Hello World!"}
```

### 3. Check Logs
```bash
# All services
podman-compose logs

# Specific service
podman-compose logs api
podman-compose logs mongodb
podman-compose logs rabbitmq

# Follow logs
podman-compose logs -f api
```

### 4. Open in Browser

- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **RabbitMQ Management**: http://localhost:15672
  - Username: `guest`
  - Password: `guest`

---

## 🐛 Troubleshooting

### Issue: "permission denied"

```bash
# Add user to podman group (jika ada)
sudo usermod -aG podman $USER
newgrp podman
```

### Issue: "short-name resolution"

**Error:**
```
Error: short-name "mongo:6.0" did not resolve to an alias
```

**Solution:** Use full image names in docker-compose.yml:
```yaml
image: docker.io/library/mongo:6.0
```

### Issue: Port already in use

```bash
# Check port usage
sudo lsof -i :3000
sudo lsof -i :27017
sudo lsof -i :5672

# Kill process
sudo kill -9 <PID>
```

### Issue: Container won't start

```bash
# Check logs
podman logs youapp-api

# Remove and recreate
podman-compose down
podman-compose up -d --build
```

---

## 🔧 Useful Commands

### Container Management
```bash
# List running containers
podman ps

# List all containers
podman ps -a

# Stop specific container
podman stop youapp-api

# Start container
podman start youapp-api

# Restart container
podman restart youapp-api

# Remove container
podman rm youapp-api
```

### Logs
```bash
# View logs
podman logs youapp-api

# Follow logs (real-time)
podman logs -f youapp-api

# Last 100 lines
podman logs --tail 100 youapp-api
```

### Clean Up
```bash
# Stop all containers
podman-compose down

# Remove all containers and volumes
podman-compose down -v

# Remove all images
podman rmi -a

# Prune system
podman system prune -a
```

---

## 📊 Expected Startup Time

- **MongoDB**: ~10 seconds
- **RabbitMQ**: ~15 seconds
- **NestJS API**: ~20-30 seconds

**Total: ~45-60 seconds** untuk semua services ready.

---

## 🎯 Quick Test Flow

Setelah aplikasi running:

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!@#"
  }'

# 2. Copy access_token dari response

# 3. Create profile
curl -X POST http://localhost:3000/api/createProfile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test User",
    "birthday": "1990-03-25",
    "gender": "Male",
    "height": 175,
    "weight": 70,
    "interests": ["coding", "music"]
  }'

# 4. Get profile
curl http://localhost:3000/api/getProfile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Aplikasi siap digunakan! 🚀**

Untuk testing lengkap, gunakan:
- **Swagger UI**: http://localhost:3000/api/docs (interactive testing)
- **Postman**: Import collection dari `Documentation/YouApp_Backend.postman_collection.json`
