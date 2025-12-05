# Инструкция по деплою

## Настройка GitHub Secrets

Для работы автодеплоя необходимо добавить следующие секреты в настройках репозитория GitHub (Settings -> Secrets and variables -> Actions):

1. `SSH_HOST` - IP адрес сервера: `194.32.142.37`
2. `SSH_USERNAME` - имя пользователя: `ubuntu`
3. `SSH_PASSWORD` - пароль от SSH
4. `REPO_URL` - URL репозитория (например: `https://github.com/username/repo.git` или `git@github.com:username/repo.git`)

**Примечание:** Переменные окружения для подключения к базе данных настраиваются вручную на сервере в файле `.env` в директории проекта.

## Первоначальная настройка сервера

1. Подключитесь к серверу:
```bash
ssh ubuntu@194.32.142.37
```

2. Установите Docker и Docker Compose (если не установлены):
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

3. Установите Git (если не установлен):
```bash
sudo apt install -y git
```

4. Настройте доступ к репозиторию (если используется приватный репозиторий):
```bash
# Для HTTPS (нужен токен доступа)
git config --global credential.helper store

# Для SSH (рекомендуется)
ssh-keygen -t ed25519 -C "deploy@photon"
# Добавьте публичный ключ в GitHub Settings -> SSH and GPG keys
```

## Ручной деплой

Для ручного деплоя используйте скрипт:
```bash
./deploy.sh
```

Или выполните команды вручную на сервере:
```bash
cd ~/photon-frontend
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Проверка работы

После деплоя приложение будет доступно по адресу:
- http://194.32.142.37:3001

Для проверки логов:
```bash
docker-compose logs -f photon-frontend
```

Для проверки статуса:
```bash
docker-compose ps
```
