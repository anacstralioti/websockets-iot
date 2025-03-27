const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');
 
const app = express();
const PORT = process.env.PORT || 8080;
 
// Define a pasta de arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
 
// Endpoint para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
 
// Cria o servidor HTTP
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
 
// Cria o servidor WebSocket vinculado ao servidor HTTP
const wss = new WebSocket.Server({ server });
 
// Função para enviar requisição HTTP para o Arduino
function sendCommandToArduino(command) {
  const options = {
    hostname: '192.168.1.100', // IP do Arduino
    port: 80,
    path: `/led/${command}`,
    method: 'GET'
  };
 
  const req = http.request(options, res => {
    console.log(`Resposta do Arduino: ${res.statusCode}`);
    res.on('data', d => {
      process.stdout.write(d);
    });
  });
 
  req.on('error', error => {
    console.error('Erro ao enviar comando para o Arduino:', error);
  });
 
  req.end();
}
 
// Trata conexões WebSocket
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado via WebSocket');
 
  ws.on('message', (message) => {
    console.log(`Mensagem recebida via WebSocket: ${message}`);
    // Envia comando ao Arduino via HTTP
    sendCommandToArduino(message);
  });
 
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});