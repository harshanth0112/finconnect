import { io } from 'socket.io-client';

let socket = null;

export const getSocket = (token) => {
  if (!socket && token) {
    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
      : 'http://localhost:5000';

    socket = io(socketUrl, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket connection error]:', err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

