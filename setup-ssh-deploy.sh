#!/bin/bash

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SSH_HOST="194.32.142.37"
SSH_USER="ubuntu"
KEY_NAME="github_actions_deploy"
KEY_PATH="$HOME/.ssh/$KEY_NAME"

echo -e "${GREEN}=== Настройка SSH ключа для GitHub Actions деплоя ===${NC}"
echo ""

# Проверяем, существует ли ключ
if [ -f "$KEY_PATH" ]; then
    echo -e "${YELLOW}Ключ $KEY_PATH уже существует.${NC}"
    read -p "Перезаписать? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Отменено."
        exit 0
    fi
    rm -f "$KEY_PATH" "$KEY_PATH.pub"
fi

# Создаем SSH ключ
echo -e "${GREEN}Шаг 1: Создание SSH ключа...${NC}"
ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$KEY_PATH" -N ""

echo ""
echo -e "${GREEN}Шаг 2: Копирование публичного ключа на сервер...${NC}"
echo "Введите пароль от сервера когда будет запрошено:"

# Копируем публичный ключ на сервер
cat "$KEY_PATH.pub" | ssh "$SSH_USER@$SSH_HOST" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

echo ""
echo -e "${GREEN}Шаг 3: Проверка подключения...${NC}"
ssh -i "$KEY_PATH" -o BatchMode=yes "$SSH_USER@$SSH_HOST" "echo 'Подключение успешно!'" || {
    echo "Ошибка: Не удалось подключиться с новым ключом"
    exit 1
}

echo ""
echo -e "${GREEN}=== Настройка завершена! ===${NC}"
echo ""
echo -e "${YELLOW}Теперь добавьте приватный ключ в GitHub Secrets:${NC}"
echo ""
echo "1. Откройте: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "2. Нажмите 'New repository secret'"
echo "3. Name: SSH_PRIVATE_KEY"
echo "4. Value: (скопируйте содержимое ниже)"
echo ""
echo "--- Начните копировать отсюда ---"
cat "$KEY_PATH"
echo "--- Конец ---"
echo ""
echo -e "${GREEN}Готово! После добавления секрета в GitHub, автодеплой будет работать.${NC}"
