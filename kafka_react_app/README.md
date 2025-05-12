# Kafka React Application

## Компоненты приложения

### 1. Бэкенд (Node.js + Express + Kafka Consumer)

#### Установка зависимостей
```sh
cd backend
npm init -y
npm install express cors kafka-node dotenv socket.io pg
```

#### Основные функции
- Получение данных из Kafka
- REST API для фронтенда
- WebSocket для real-time обновлений
- Сохранение данных в PostgreSQL

### 2. Фронтенд (React.js)

#### Установка зависимостей
```sh
cd frontend
npx create-react-app .
npm install axios socket.io-client @mui/material @mui/icons-material recharts
```

#### Основные функции
- Визуализация данных в реальном времени
- Графики исторических данных
- Material UI компоненты
- WebSocket подключение

## Разработка

### Запуск бэкенда
```sh
cd backend
npm run dev
```

### Запуск фронтенда
```sh
cd frontend
npm start
```

## Переменные окружения

### Бэкенд (.env)
```
PORT=3000
KAFKA_BROKERS=kafka:9092
POSTGRES_USER=user
POSTGRES_PASSWORD=root
POSTGRES_DB=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

### Фронтенд (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```


