const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;

const SOCKET_EVENTS = {
  CLAP: 'clap',
  OPEN_CURTAIN: 'open-curtain',
  CLOSE_CURTAIN: 'close-curtain',
  RING_BELL: 'ring-bell',
  START_INTERMISSION: 'start-intermission',
  END_PLAY: 'end-play'
}
 
const wss = new WebSocket.Server({ port: PORT });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(event) {
    console.log('received event: ', event);

    wss.clients.forEach(function each(client) {
      // client !== ws && 
      if (client.readyState === WebSocket.OPEN) {
        switch(event) {
          case SOCKET_EVENTS.CLAP:
            client.send(SOCKET_EVENTS.CLAP);
            break;
          case SOCKET_EVENTS.OPEN_CURTAIN:
            client.send(SOCKET_EVENTS.OPEN_CURTAIN);
            break;
          case SOCKET_EVENTS.CLOSE_CURTAIN:
            client.send(SOCKET_EVENTS.CLOSE_CURTAIN);
            break;
          case SOCKET_EVENTS.RING_BELL:
            client.send(SOCKET_EVENTS.RING_BELL);
            break;
          case SOCKET_EVENTS.START_INTERMISSION:
            client.send(SOCKET_EVENTS.START_INTERMISSION);
            break;
          case SOCKET_EVENTS.END_PLAY:
            client.send(SOCKET_EVENTS.END_PLAY);
            break;
        }
      }
    });
  });
});