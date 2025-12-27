# 🐳 Docker Quick Start

Panduan cepat install Docker dan menjalankan aplikasi.

---

## ⚡ Install Docker (1 Command)

```bash
cd /home/alice/GBCI_Ventures_test/youapp-backend
bash setup-docker.sh
```

Setelah selesai, activate group:
```bash
newgrp docker
```

---

## 🚀 Jalankan Aplikasi

### Step 1: Start Docker Service
```bash
sudo service docker start
```

### Step 2: Run Application
```bash
cd /home/alice/GBCI_Ventures_test/youapp-backend
docker compose up -d --build
```

**Tunggu ~60 detik untuk build & start.**

### Step 3: Verify
```bash
# Check containers
docker ps

# Test API
curl http://localhost:3000
```

---

## 🌐 Access Points

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **RabbitMQ**: http://localhost:15672 (guest/guest)

---

## 🔧 Useful Commands

```bash
# View logs
docker compose logs -f

# Stop
docker compose down

# Restart
docker compose restart

# Clean up
docker compose down -v
```

---

## 🐛 Troubleshooting

### Docker service not running
```bash
sudo service docker start
sudo service docker status
```

### Permission denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Port already in use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

---

**Ready! 🚀**
