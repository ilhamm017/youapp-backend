#!/bin/bash

# Setup Script untuk Podman di WSL Ubuntu
# Run dengan: bash setup-podman.sh

set -e

echo "🚀 YouApp Backend - Podman Setup Script"
echo "=========================================="
echo ""

# Update package list
echo "📦 Step 1/5: Updating package list..."
sudo apt-get update -qq

# Install Podman
echo "🐳 Step 2/5: Installing Podman..."
sudo apt-get install -y podman

# Verify Podman installation
echo "✅ Step 3/5: Verifying Podman..."
podman --version

# Install podman-compose
echo "🔧 Step 4/5: Installing podman-compose..."
sudo apt-get install -y python3-pip
pip3 install podman-compose --user

# Add to PATH if not already
if ! grep -q "export PATH=\$HOME/.local/bin:\$PATH" ~/.bashrc; then
    echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
    export PATH=$HOME/.local/bin:$PATH
fi

# Verify podman-compose
echo "✅ Step 5/5: Verifying podman-compose..."
podman-compose --version || pip3 show podman-compose

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Reload bash: source ~/.bashrc"
echo "2. Go to project: cd /home/alice/GBCI_Ventures_test/youapp-backend"
echo "3. Run application: podman-compose up -d --build"
echo ""
echo "🔍 Verify containers running:"
echo "   podman ps"
echo ""
echo "🌐 Access application:"
echo "   - API: http://localhost:3000"
echo "   - Swagger: http://localhost:3000/api/docs"
echo "   - RabbitMQ: http://localhost:15672 (guest/guest)"
echo ""
