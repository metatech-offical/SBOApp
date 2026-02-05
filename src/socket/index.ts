import {SOCKET_URL} from '@rtkServices/endpoints';
import {getToken} from '@utils/general';
import {Socket, io} from 'socket.io-client';

export let socket: Socket | null = null;

async function socketService(): Promise<void> {
  let {accessToken: token} = await getToken();
  return new Promise((resolve, reject) => {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: false,
      reconnectionAttempts: Infinity,
      timeout: 20000,
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('- socket connected -');
      resolve(); // Resolve the promise when connected
    });

    socket.on('disconnect', reason => {
      console.log(`socket disconnected reason - ${reason}`);
    });

    socket.on('connect_error', error => {
      console.log('socket connection error:', error);
      reject(error);
    });
  });
}

function socketEmit(evt: string, data?: any) {
  socket?.emit(evt, data);
}

function socketListen(event: string, cb: any) {
  socket?.on(event, cb);
}

function socketDisconnect() {
  socket?.disconnect();
}

export {socketEmit, socketDisconnect, socketListen, socketService};
