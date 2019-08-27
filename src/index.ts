import WebSocket from 'ws';

interface Incoming {
  id: string;
  message: string;
  name: string;
}

let wsServeStarted = false;
const sessions = new Map();
function start() {
  if (wsServeStarted) {
    console.error('ws server already started');
    return;
  }
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', ws => {
    ws.on('message', (incoming: string) => {
      const cleanIncoming: Incoming = JSON.parse(incoming);
      if (!sessions.has(cleanIncoming.id)) {
        sessions.set(cleanIncoming.id, ws);
      }

      Array.from( sessions.keys())
        .filter((k: string) => k !== cleanIncoming.id)
        .forEach((s: string) => {
          if (cleanIncoming.message !== undefined && cleanIncoming.message.length > 0) {
            sessions.get(s)
              .send(JSON.stringify({message: cleanIncoming.message, name: cleanIncoming.name}));
          }
        });
    });

        // ws.send('CONNECTED');
  });

  console.log('listening on http://localhost:8080');
  wsServeStarted = true;
}

start();
