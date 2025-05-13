FROM python:3.9-slim

# Установка переменных окружения для pip
ENV PIP_DEFAULT_TIMEOUT=1000
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PIP_NO_CACHE_DIR=1

# Установка необходимых системных зависимостей
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Установка рабочей директории
WORKDIR /app

# Копирование requirements.txt
COPY requirements.txt .

# Установка PyTorch с CUDA отдельно
RUN pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# Установка остальных зависимостей
RUN pip install --no-cache-dir -r requirements.txt \
    || pip install --no-cache-dir --index-url https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

# Копирование исходного кода
COPY . .

# Запуск скрипта
CMD ["python", "run_camera.py"]