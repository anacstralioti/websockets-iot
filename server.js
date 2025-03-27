const express = require('express');
const mqtt = require('mqtt');
const app = express();
const PORT = process.env.PORT || 8080;

// Configuração MQTT
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
const mqttTopic = 'casa/led';

mqttClient.on('connect', () => {
  console.log('Conectado ao broker MQTT');
});

app.use(express.static('public'));

// Rota para controlar o LED via MQTT
app.get('/led/:command', (req, res) => {
  const command = req.params.command;
  mqttClient.publish(mqttTopic, command);
  res.send(`Comando "${command}" enviado ao Arduino!`);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});