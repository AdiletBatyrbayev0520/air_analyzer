from flask import Flask, jsonify
from kafka import KafkaConsumer
import json

app = Flask(__name__)

KAFKA_BROKER = "10.20.195.16:9092"
TOPIC = "sensor_data"

consumer = KafkaConsumer(
    'sensor_data',
    bootstrap_servers='10.20.195.16:9092',
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='group1'
)

@app.route("/", methods=["GET"])
def home():
    return "Kafka Sensor Data API. Use /data to get the latest messages."

@app.route("/data", methods=["GET"])
def get_sensor_data():
    """Считывает последние сообщения из Kafka при каждом запросе."""
    messages = []
    for message in consumer:
        decoded_message = message.value.decode('utf-8') 
        print(f"📥 Получено сообщение: {decoded_message}")
        
        messages.append(decoded_message)
        if len(messages) >= 10: 
            break

    if not messages:
        return jsonify({"error": "No messages received yet"})

    return jsonify(messages)

if __name__ == "__main__":
    print("✅ Flask API запущен! Ожидание HTTP-запросов...")
    app.run(host="0.0.0.0", port=5001, debug=True)
