# Kafka Real-Time Sensor Monitoring

Проект для мониторинга данных с сенсоров в реальном времени, использующий Kafka для обработки потоков данных и React для визуализации.

## Архитектура проекта

- **Frontend**: React приложение для отображения данных
- **Backend**: Node.js сервер с Express для обработки данных из Kafka
- **Kafka**: Система обработки потоков данных
- **Jupyter**: Ноутбук для анализа и тестирования

## Структура проекта

```
.
├── kafka_react_app/
│   ├── frontend/         # React приложение
│   └── backend/          # Node.js сервер
├── myjupyter/           # Jupyter ноутбуки
└── docker-compose.yml   # Docker конфигурация
```

## Запуск проекта

1. Сборка Jupyter образа:
```sh
cd myjupyter/
docker build -t jupyter .
cd ..
```

2. Запуск всех сервисов:
```sh
docker-compose up -d
```

## Доступ к сервисам

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Kafka: localhost:9092 (internal), localhost:9093 (external)
- Jupyter: http://localhost:8888
- Kafka REST: http://localhost:8082

## Проверка работы Kafka

Для проверки работы Kafka выполните:

```sh
docker exec -it kafka bash
cd opt/bitnami/kafka/bin/
kafka-console-consumer.sh --bootstrap-server localhost:9093 --topic f103 --from-beginning
```

## Топики Kafka

Проект использует следующие топики:
- f103: Данные с сенсора в комнате F103
- i111: Данные с сенсора в комнате I111
- canteen: Данные с сенсора в столовой
- hall: Данные с сенсора в холле

## Требования

- Docker
- Docker Compose

## Источник

Проект основан на [Seeed Studio Wiki](https://wiki.seeedstudio.com/xiao_esp32c6_kafka/) с существенными модификациями и улучшениями.