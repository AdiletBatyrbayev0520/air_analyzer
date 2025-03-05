# Task List Web Page

This project contains an HTML and CSS-based task list web page with a styled container displaying a list of tasks. It also includes setup instructions for running Kafka on Docker.

## Task List Page

The HTML page consists of:
- A styled task list interface.
- A list of Kafka-related tasks such as configuring replications, setting TTL, and defining a partition key.

## Source

This project is based on [Seeed Studio Wiki](https://wiki.seeedstudio.com/xiao_esp32c6_kafka/). Some provided codes from the original source might not work correctly, so using verified codes from GitHub is recommended.

---

## Setup Instructions

### Commands to Start

Run the following commands in the terminal to set up the project:

```sh
cd myjupyter/
docker build -t jupyter .
cd ..
cd myserver/
docker build -t pyserver .
cd ..
docker-compose up -d
```

### Verify Kafka on Docker

To check if Kafka is running inside Docker, use these commands:

```sh
docker exec -it kafka bash
cd opt/bitnami/kafka/bin/
kafka-console-consumer.sh --bootstrap-server localhost:9093 --topic my_topic --from-beginning
```

These commands will allow you to interact with Kafka and confirm that it's working properly.

---

## Requirements

- Docker & Docker Compose installed
- Kafka setup inside Docker

## License

This project follows an open-source license. Modify and use it as needed.

---

For any issues, refer to the documentation or check GitHub for updated code snippets.