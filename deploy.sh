#!/bin/bash

set -e

echo "Starting deployment..."

# Переходим в директорию проекта
if [ ! -d ~/photon-frontend ]; then
    echo "Error: Directory ~/photon-frontend not found."
    echo "Please clone the repository first: git clone <YOUR_REPO_URL> ~/photon-frontend"
    exit 1
fi

cd ~/photon-frontend

# Обновляем код из репозитория
echo "Pulling latest code..."
git pull origin main

# Проверяем наличие .env файла (опционально)
if [ ! -f .env ]; then
    echo "Info: .env file not found. If you need environment variables, create .env file."
fi

# Останавливаем старый контейнер
echo "Stopping old container..."
docker compose down || true

# Собираем новый образ
echo "Building new image..."
docker compose build --no-cache

# Запускаем контейнер
echo "Starting container..."
docker compose up -d

# Очищаем старые образы
echo "Cleaning up old images..."
docker image prune -f

# Проверяем статус контейнера
echo "Checking container status..."
sleep 5
docker compose ps

echo "Deployment completed successfully!"
echo "Application is running on port 3001"
