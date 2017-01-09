/*
  It will MqttReconnect to the server if the connection is lost using a blocking
  MqttReconnect function. See the 'mqtt_MqttReconnect_nonblocking' example for how to
  achieve the same result without blocking the main loop.
*/

// Includes
#include <ESP8266WiFi.h>  // ESP board
#include <RCSwitch.h>     // 433 MHz radio
#include "PubSubClient.h" // MQTT
#include "WEMOS_SHT3X.h"  // Temperature and humidity
#include <ArduinoJson.h>  // JSON helper
#include <time.h>         // Time

// WiFi Settings
const char* wifi_ssid = "IreHOST";
const char* wifi_pwd = "ChciZazit";

// Time
const char* time_source1 = "pool.ntp.org";
const char* time_source2 = "time.nist.gov";

// MQTT server
const char* mqtt_server = "jkiothub.azure-devices.net";

// mqttClients
WiFiClientSecure epsWiFiClient;
PubSubClient mqttClient(epsWiFiClient);

// 433 MHz radio controller
RCSwitch rcClient = RCSwitch();

// Temperature and humidity controller
SHT3X sht30Client(0x45);

long timeFromLastMessage = 0;

const int AMBIENT_LIGHT_PIN = A0;
const int PIR_PIN = D3;

// Initializes current time
void initTime() {
  time_t epochTime;
  configTime(0, 0, time_source1, time_source2);
  while (true) {
    epochTime = time(NULL);
    if (epochTime == 0) {
      Serial.println("Fetching NTP epoch time failed! Waiting 2 seconds to retry.");
      delay(2000);
    } else {
      Serial.print("Fetched NTP epoch time is: ");
      Serial.println(epochTime);
      break;
    }
  }
}

// Initializes WiFi
void initWifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);

  WiFi.begin(wifi_ssid, wifi_pwd);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// MQTT incoming message handler
void MqttIncomingMessageHandler(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  String cmd = String();

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    cmd += (char)payload[i];

  }
  Serial.println(cmd);
  Serial.println();

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(cmd);

  const char* action = root["action"];
  const char* actor = root["actor"];

  String actionString = String(action);
  String actorString = String(actor);

  Serial.println(action);
  Serial.println(actionString);
  Serial.println(actor);

  if (actionString.equals("switchOn") && actorString.equals("lights"))
  {
    Serial.println("Turning lights on");
    //rcClient.send(14013452, 24);

    rcClient.send(13988876, 24);

    //rcClient.send(13982732, 24);
  }
  else if (actionString.equals("switchOff") && actorString.equals("lights"))
  {
    Serial.println("Turning kights off");
    //rcClient.send(14013443, 24);

    rcClient.send(13988867, 24);

    //rcClient.send(13982723, 24);
  }
}

// MqttReconnect to MQTT
void MqttReconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("jk01", "jkiothub.azure-devices.net/jk01", "SharedAccessSignature sr=jkiothub.azure-devices.net%2Fdevices%2Fjk01&sig=l%2BToD8LnqJHbTX%2FS8rHBvNyiNcNgF7tmX9ekLO5KE2A%3D&se=1514922089"))
    {
      Serial.println("connected");
      mqttClient.subscribe("devices/jk01/messages/devicebound/#", 1);
    } else {
      Serial.print("failed, rcClient=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// Setup board
void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  pinMode(AMBIENT_LIGHT_PIN, INPUT);
  pinMode(PIR_PIN, INPUT_PULLUP);

  Serial.begin(115200);
  initWifi();
  initTime();

  rcClient.enableTransmit(12); // GPIO 12 = D6
  rcClient.setPulseLength(308);

  mqttClient.setServer(mqtt_server, 8883);
  mqttClient.setCallback(MqttIncomingMessageHandler);
}

// Main loop
void loop() {

  if (!mqttClient.connected()) {
    MqttReconnect();
  }
  mqttClient.loop();

  long now = millis();

  if (now - timeFromLastMessage   > 2000) {
    timeFromLastMessage = now;
    Serial.print("Publish message: ");


    sht30Client.get();
    //    Serial.print("Temperature in Celsius : ");
    //    Serial.println(sht30Client.cTemp);
    //    Serial.print("Temperature in Fahrenheit : ");
    //    Serial.println(sht30Client.fTemp);
    //    Serial.print("Relative Humidity : ");
    //    Serial.println(sht30Client.humidity);
    //    Serial.println();
    unsigned int light = analogRead(AMBIENT_LIGHT_PIN);
    //    Serial.println(light);

    if (light < 50)
      light = 0;
    else
      light = 100;

    bool motion = false;
    int pirValState = digitalRead(PIR_PIN);
    if (pirValState == LOW)
    {
      // motion
      motion = true;
    }
    else
    {
      motion = false;
      // no motion
    }
    Serial.println(motion);

    time_t epochTime = time(NULL);
    //Serial.println(".........");
    //Serial.println(epochTime);

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    root["deviceId"] = "jk01";
    root["humidity"] = sht30Client.humidity;
    root["temperature"] = sht30Client.cTemp;
    root["timestamp"] = epochTime;
    root["light"] = light;
    root["move"] = motion;
    //    root.printTo(Serial);

    String s;
    root.printTo(s);
    //    Serial.println(s);

    const char *cstr = s.c_str();


    mqttClient.publish("devices/jk01/messages/events/", cstr);
  }
}

