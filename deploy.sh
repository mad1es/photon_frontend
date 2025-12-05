#!/bin/bash

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
SSH_HOST="194.32.142.37"
SSH_USER="ubuntu"
SSH_PORT="22"
PROJECT_DIR="photon-frontend"
REMOTE_DIR="~/photon-frontend"
PORT="3001"

echo -e "${GREEN}=== Деплой Photon Frontend ===${NC}"

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo -e "${YELLOW}Предупреждение: .env файл не найден. Убедитесь, что переменные окружения настроены на сервере.${NC}"
fi

# Функция для выполнения команд на сервере
execute_remote() {
    ssh ${SSH_USER}@${SSH_HOST} "$1"
}

echo -e "${GREEN}Шаг 1: Подключение к серверу...${NC}"

# Проверяем подключение
if ! ssh -o ConnectTimeout=5 ${SSH_USER}@${SSH_HOST} "echo 'Connected'" > /dev/null 2>&1; then
    echo -e "${RED}Ошибка: Не удалось подключиться к серверу${NC}"
    exit 1
fi

echo -e "${GREEN}Шаг 2: Проверка наличия Docker и Docker Compose...${NC}"

# Проверяем наличие Docker
if ! execute_remote "command -v docker" > /dev/null 2>&1; then
    echo -e "${RED}Ошибка: Docker не установлен на сервере${NC}"
    exit 1
fi

# Проверяем наличие Docker Compose
if ! execute_remote "command -v docker-compose" > /dev/null 2>&1; then
    echo -e "${YELLOW}Docker Compose не найден, проверяем docker compose (v2)...${NC}"
    if ! execute_remote "docker compose version" > /dev/null 2>&1; then
        echo -e "${RED}Ошибка: Docker Compose не установлен на сервере${NC}"
        exit 1
    fi
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${GREEN}Шаг 3: Клонирование/обновление репозитория на сервере...${NC}"

# Клонируем или обновляем репозиторий
execute_remote "
    if [ -d ${REMOTE_DIR} ]; then
        echo 'Репозиторий существует, обновляем...'
        cd ${REMOTE_DIR}
        git pull origin main || git pull origin master
    else
        echo 'Клонируем репозиторий...'
        git clone \$(git remote get-url origin) ${REMOTE_DIR} || {
            echo 'Ошибка: Не удалось клонировать репозиторий'
            echo 'Убедитесь, что сервер имеет доступ к репозиторию'
            exit 1
        }
    fi
"

echo -e "${GREEN}Шаг 4: Копирование файлов на сервер...${NC}"

# Копируем необходимые файлы
scp Dockerfile ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/
scp docker-compose.yml ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/
scp .dockerignore ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/

# Копируем .env если существует
if [ -f .env ]; then
    scp .env ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/.env
    echo -e "${GREEN}.env файл скопирован${NC}"
fi

echo -e "${GREEN}Шаг 5: Остановка старых контейнеров...${NC}"

execute_remote "
    cd ${REMOTE_DIR}
    ${COMPOSE_CMD} down || true
"

echo -e "${GREEN}Шаг 6: Сборка и запуск контейнера...${NC}"

execute_remote "
    cd ${REMOTE_DIR}
    ${COMPOSE_CMD} build --no-cache
    ${COMPOSE_CMD} up -d
"

echo -e "${GREEN}Шаг 7: Проверка статуса контейнера...${NC}"

sleep 5

execute_remote "
    cd ${REMOTE_DIR}
    ${COMPOSE_CMD} ps
    echo ''
    echo 'Логи контейнера:'
    ${COMPOSE_CMD} logs --tail=50 photon-frontend
"

echo -e "${GREEN}Шаг 8: Очистка неиспользуемых образов...${NC}"

execute_remote "docker image prune -f"

echo -e "${GREEN}=== Деплой завершен успешно! ===${NC}"
echo -e "${GREEN}Приложение доступно по адресу: http://${SSH_HOST}:${PORT}${NC}"
