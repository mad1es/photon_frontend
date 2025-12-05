#!/bin/bash

# Скрипт для создания swap файла на сервере
# Запустите на сервере: bash setup-swap.sh

set -e

SWAP_SIZE="2G"
SWAP_FILE="/swapfile"

echo "Checking current swap..."
free -h

if [ -f "$SWAP_FILE" ]; then
    echo "Swap file already exists. Checking if it's active..."
    if swapon --show | grep -q "$SWAP_FILE"; then
        echo "Swap is already active."
        free -h
        exit 0
    fi
fi

echo "Creating ${SWAP_SIZE} swap file..."

# Создаем swap файл
sudo fallocate -l $SWAP_SIZE $SWAP_FILE || sudo dd if=/dev/zero of=$SWAP_FILE bs=1024 count=$((${SWAP_SIZE%G} * 1024 * 1024))

# Устанавливаем правильные права
sudo chmod 600 $SWAP_FILE

# Форматируем как swap
sudo mkswap $SWAP_FILE

# Активируем swap
sudo swapon $SWAP_FILE

# Делаем постоянным (добавляем в /etc/fstab)
if ! grep -q "$SWAP_FILE" /etc/fstab; then
    echo "$SWAP_FILE none swap sw 0 0" | sudo tee -a /etc/fstab
fi

echo "Swap created and activated successfully!"
free -h

echo ""
echo "To verify swap is working:"
echo "  free -h"
echo ""
echo "To remove swap later (if needed):"
echo "  sudo swapoff $SWAP_FILE"
echo "  sudo rm $SWAP_FILE"
echo "  sudo sed -i '/$SWAP_FILE/d' /etc/fstab"
