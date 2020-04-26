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

const PHASES = {
  BEFORE_THE_BELL: 'before_the_bell',
  AFTER_THE_BELL: 'after_the_bell',
  SHOW_TIME: 'show_time',
  INTERMISSION: 'intermission',
  AFTER_THE_SHOW: 'after_the_show',
}
 
const wss = new WebSocket.Server({ port: PORT });

const playState = {
  curtainOpen: false,
  totalClapCount: 0,
  currentPhase: PHASES.BEFORE_THE_BELL,
  currentAct: 1,
  timerEnd: null,
}
 
wss.on('connection', function connection(ws) {
  console.log('connection')
  try {
    ws.send(JSON.stringify(playState))
  } catch (err) {
    console.log('error when sending play state on connection: ', err)
  }

  ws.on('message', function incoming(event) {
    console.log('received event: ', event);

    // handle play state
    switch(event) {
      case SOCKET_EVENTS.CLAP:
        playState.totalClapCount++
        break;
      case SOCKET_EVENTS.OPEN_CURTAIN:
        playState.curtainOpen = true
        break;
      case SOCKET_EVENTS.CLOSE_CURTAIN:
        playState.curtainOpen = false
        break;
      case SOCKET_EVENTS.RING_BELL:
        playState.currentPhase = PHASES.AFTER_THE_BELL
        // set timeout to start the play
        break;
      case SOCKET_EVENTS.START_INTERMISSION:
        playState.currentPhase = PHASES.INTERMISSION
        playState.currentAct ++
        // set timeout to start act 2
        break;
      case SOCKET_EVENTS.END_PLAY:
        playState.currentPhase = PHASES.AFTER_THE_SHOW
        break;
    }

    // send event to all clients
    wss.clients.forEach(function each(client) {
      // client !== ws && -> for now we want to send events back to the client for demo purposes
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