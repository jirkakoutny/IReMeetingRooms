/*
  Basic ESP8266 MQTT example

  This sketch demonstrates the capabilities of the pubsub library in combination
  with the ESP8266 board/library.

  It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

  It will reconnect to the server if the connection is lost using a blocking
  reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
  achieve the same result without blocking the main loop.

  To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include "PubSubClient.h"
#include <RCSwitch.h>
#include "WEMOS_SHT3X.h"
#include <ArduinoJson.h>
#include <time.h>

// Update these with values suitable for your network.

const char* ssid = "IreHOST";
const char* password = "ChciZazit";
const char* mqtt_server = "jkiothub.azure-devices.net";

WiFiClientSecure espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
const int LIGHT_PIN = A0;
const int PIR_PIN = D3;

RCSwitch rc = RCSwitch();
SHT3X sht30(0x45);

void initTime() {
  time_t epochTime;
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
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

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
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
    rc.send(14013452, 24);
    
    rc.send(13988876, 24);
    
    rc.send(13982732, 24);
  }
  else if (actionString.equals("switchOff") && actorString.equals("lights"))
  {
    Serial.println("Turning kights off");
    rc.send(14013443, 24);
    
    rc.send(13988867, 24);
    
    rc.send(13982723, 24);
  }

  // Switch on the LED if an 1 was received as first character
  //  if ((char)payload[0] == '1') {
  //    digitalWrite(BUILTIN_LED, LOW);   // Turn the LED on (Note that LOW is the voltage level
  //    // but actually the LED is on; this is because
  //    // it is acive low on the ESP-01)
  //  } else {
  //    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  //  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    //    String clientId = "ESP8266Client-";
    //    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect("jk01", "jkiothub.azure-devices.net/jk01", "SharedAccessSignature sr=jkiothub.azure-devices.net%2Fdevices%2Fjk01&sig=l%2BToD8LnqJHbTX%2FS8rHBvNyiNcNgF7tmX9ekLO5KE2A%3D&se=1514922089"))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      //client.publish("devices/jk01/messages/events/", "hello world");
      // ... and resubscribe
      client.subscribe("devices/jk01/messages/devicebound/#");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  pinMode(LIGHT_PIN, INPUT);
  pinMode(PIR_PIN, INPUT_PULLUP);

  Serial.begin(115200);
  setup_wifi();
  initTime();

  rc.enableTransmit(12); // GPIO 12 = D6
  rc.setPulseLength(308);

  client.setServer(mqtt_server, 8883);
  client.setCallback(callback);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  //if (now - lastMsg > 30000) {
    if (now - lastMsg > 2000) {
    lastMsg = now;

    Serial.print("Publish message: ");


    sht30.get();
    //    Serial.print("Temperature in Celsius : ");
    //    Serial.println(sht30.cTemp);
    //    Serial.print("Temperature in Fahrenheit : ");
    //    Serial.println(sht30.fTemp);
    //    Serial.print("Relative Humidity : ");
    //    Serial.println(sht30.humidity);
    //    Serial.println();
    unsigned int light = analogRead(LIGHT_PIN);
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
    root["humidity"] = sht30.humidity;
    root["temperature"] = sht30.cTemp;
    root["timestamp"] = epochTime;
    root["light"] = light;
    root["move"] = motion;
    //    root.printTo(Serial);

    String s;
    root.printTo(s);
    //    Serial.println(s);

    const char *cstr = s.c_str();


    client.publish("devices/jk01/messages/events/", cstr);
  }
}
