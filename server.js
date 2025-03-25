const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  // Ping para evitar timeout
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000); // A cada 30 segundos

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
    if (message === "ping") {
      ws.send("pong");
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clearInterval(pingInterval);
  });
});

function broadcast(command) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(command);
    }
  });
}

module.exports = { broadcast };