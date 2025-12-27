#!/bin/bash

# Docker Installation Script for WSL Ubuntu
# Run dengan: bash setup-docker.sh

set -e

echo "🐳 YouApp Backend - Docker Setup Script"
echo "=========================================="
echo ""

# Update package list
echo "📦 Step 1/7: Updating package list..."
sudo apt-get update -qq

# Install prerequisites
echo "🔧 Step 2/7: Installing prerequisites..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
echo "🔑 Step 3/7: Adding Docker GPG key..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo "📚 Step 4/7: Setting up Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list again
echo "📦 Step 5/7: Updating package list..."
sudo apt-get update -qq

# Install Docker Engine
echo "🐳 Step 6/7: Installing Docker Engine..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
echo "👤 Step 7/7: Adding user to docker group..."
sudo usermod -aG docker $USER

echo ""
echo "✅ Docker installation complete!"
echo ""
echo "📋 IMPORTANT: You need to log out and log back in for group changes to take effect."
echo "   Or run: newgrp docker"
echo ""
echo "🚀 Start Docker service:"
echo "   sudo service docker start"
echo ""
echo "✅ Verify installation:"
echo "   docker --version"
echo "   docker compose version"
echo ""
echo "🎯 Run application:"
echo "   cd /home/alice/GBCI_Ventures_test/youapp-backend"
echo "   sudo service docker start"
echo "   docker compose up -d --build"
echo ""
