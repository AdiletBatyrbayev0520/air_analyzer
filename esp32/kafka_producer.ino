#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <Adafruit_CCS811.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <esp_sleep.h> 

#define TIME_TO_SLEEP 60
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define SEALEVELPRESSURE_HPA (1013.25)

// WiFi credentials
#define WIFI_SSID "Ai_lab"
#define WIFI_PASSWORD "ailab2024"

// Kafka Server Settings
// #define KAFKA_REST_URL "http://10.20.195.16:8082/topics/f103"
#define KAFKA_REST_URL "http://10.36.40.22:8082/topics/i111"
#define ALTERNATIVE_KAFKA_REST_URL "http://192.168.0.247:8082/topics/i111"

// #define KAFKA_REST_URL "http://10.20.195.16:8082/topics/canteen"
// #define KAFKA_REST_URL "http://10.20.195.16:8082/topics/hall"

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
Adafruit_BME280 bme;
Adafruit_CCS811 ccs811;

bool isBmeBegin;
bool isOledBegin;
bool isCcs811Begin;
bool isConnectedToWifi = false;
unsigned long sendDataPrevMillis = 0;
uint16_t co2 = -1;
uint16_t tvoc = -1;

void setup() {
    Serial.begin(115200);

    isOledBegin = display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
    if (!isOledBegin) Serial.println(F("SSD1306 allocation failed"));

    isBmeBegin = bme.begin(0x76);
    if (!isBmeBegin) Serial.println("Could not find a valid BME280 sensor, check wiring!");

    if (!ccs811.begin()) {
        Serial.println("Failed to start CCS811 sensor!");
        isCcs811Begin = false;
    } else {
        isCcs811Begin = true;
        ccs811.setDriveMode(CCS811_DRIVE_MODE_1SEC);
        
        Serial.println("Ожидание инициализации CCS811 (20 сек)...");
        for (int i = 0; i < 20; i++) {
            if (ccs811.available()) {
                Serial.println("CCS811 готов к работе!");
                break;
            }
            delay(1000);
        }
    }

    delay(2000);
    if (isOledBegin) {
        display.clearDisplay();
        display.setTextColor(WHITE);
    }

    initWifi();

    if (isOledBegin) {
      display.clearDisplay();
      if (isBmeBegin) printBmeIntoOled();
      if (isCcs811Begin) printCcs811IntoOled();
      display.display();
    }

    if (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0) {
      sendDataPrevMillis = millis();
      sendSensorDataToKafka();
    }

    delay(1000);

    esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * 1000000ULL); // Устанавливаем таймер на 5 минут
    esp_deep_sleep_start();  // Уходим в глубокий сон
}

void loop() {}

void initWifi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");

    int count = 0;
    while (count < 20 && WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        count++;
    }

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("\nCannot connect to Wi-Fi");
        isConnectedToWifi = false;
        ESP.restart();
    } else {
        Serial.println("\nConnected to Wi-Fi");
        isConnectedToWifi = true;
    }
}

void sendSensorDataToKafka() {
  if (isBmeBegin) {
    float temperature = bme.readTemperature();
    float humidity = bme.readHumidity();
    float pressure = bme.readPressure() / 100.0F;
    float altitude = bme.readAltitude(SEALEVELPRESSURE_HPA);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String jsonPayload = "{ \"records\": [{ \"value\": {";
      jsonPayload += "\"temperature\": " + String(temperature) + ",";
      jsonPayload += "\"humidity\": " + String(humidity) + ",";
      jsonPayload += "\"pressure\": " + String(pressure) + ",";
      jsonPayload += "\"altitude\": " + String(altitude) + ",";
      jsonPayload += "\"co2\": " + String(co2) + ",";
      jsonPayload += "\"tvoc\": " + String(tvoc);
      jsonPayload += "}}]}";


      http.begin(KAFKA_REST_URL);
      http.addHeader("Content-Type", "application/vnd.kafka.json.v2+json");
      
      Serial.println("Trying primary Kafka URL...");
      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode <= 0) {
        Serial.println("Primary Kafka URL failed. Trying alternative URL...");
        http.end();
        http.begin(ALTERNATIVE_KAFKA_REST_URL);
        http.addHeader("Content-Type", "application/vnd.kafka.json.v2+json");
        httpResponseCode = http.POST(jsonPayload);
      }

      if (httpResponseCode > 0) {
        Serial.print("Kafka Response: ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.println(response);
      } else {
        Serial.print("Error sending to both Kafka URLs. HTTP code: ");
        Serial.println(httpResponseCode);
      Serial.println("Sending data to Kafka...");
      Serial.println(jsonPayload);



      http.end();
    } else {
      Serial.println("WiFi disconnected");
    }
  }
}

void printBmeIntoOled() {
    display.setTextSize(0.9);
    display.setCursor(0, 0);
    display.print("Temp: ");
    display.print(bme.readTemperature());
    display.print(" C");

    display.setCursor(0, 9);
    display.print("Hum: ");
    display.print(bme.readHumidity());
    display.print(" %");

    display.setCursor(0, 18);
    display.print("Pres: ");
    display.print(bme.readPressure() / 100.0F);
    display.print(" hPa");

    display.setCursor(0, 27);
    display.print("Alt: ");
    display.print(bme.readAltitude(SEALEVELPRESSURE_HPA));
    display.print(" m");
}

void printCcs811IntoOled() {
    if (ccs811.available()) {
        if (!ccs811.readData()) {
            co2 = ccs811.geteCO2();
            tvoc = ccs811.getTVOC();

            display.setTextSize(0.9);
            display.setCursor(0, 36);
            display.print("CO2: ");
            display.print(co2);
            display.print(" ppm");

            display.setCursor(0, 45);
            display.print("TVOC: ");
            display.print(tvoc);
            display.print(" ppb");
        } else {
            Serial.println("Ошибка чтения CCS811");
        }
    } else {
        Serial.println("CCS811 ещё не готов к передаче данных.");
    }
}
