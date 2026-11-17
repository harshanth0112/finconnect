const { Server } = require('socket.io');
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const messageService = require('../services/messageService');
const notificationService = require('../services/notificationService');

let globalIO = null;

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  globalIO = io;

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split('Bearer ')[1];
      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      if (!user) {
        return next(new Error('User not found in system'));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.error('[Socket Auth Error]:', err.message);
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    // Join personal room for notifications/direct pings
    socket.join(`user:${user._id.toString()}`);

    // Join Conversation room
    socket.on('join_conversation', async ({ conversationId }) => {
      try {
        if (!conversationId) return;
        // Verify user is participant
        const conv = await Conversation.findOne({
          _id: conversationId,
          participants: user._id
        });

        if (conv) {
          socket.join(`conversation:${conversationId}`);
        } else {
          socket.emit('error', { message: 'Unauthorized conversation access' });
        }
      } catch (err) {
        console.error('[join_conversation] Error:', err);
      }
    });

    // Leave Conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    // Typing status indicators
    socket.on('typing_start', ({ conversationId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing_start', {
          conversationId,
          userId: user._id,
          fullName: user.fullName
        });
      }
    });

    socket.on('typing_stop', ({ conversationId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing_stop', {
          conversationId,
          userId: user._id
        });
      }
    });

    // Send Message
    socket.on('send_message', async ({ conversationId, text, mediaUrl, mediaType }, callback) => {
      try {
        const message = await messageService.sendMessage(user._id, conversationId, {
          text,
          mediaUrl,
          mediaType
        });

        // Broadcast to everyone in conversation room including sender
        io.to(`conversation:${conversationId}`).emit('receive_message', message);

        // Notify participants who might not have conversation open
        const conv = await Conversation.findById(conversationId);
        if (conv) {
          conv.participants.forEach(async (pId) => {
            if (pId.toString() !== user._id.toString()) {
              io.to(`user:${pId.toString()}`).emit('new_message_notification', {
                conversationId,
                message
              });

              // Create persistent notification for new message
              await notificationService.createNotification({
                recipient: pId,
                sender: user._id,
                type: 'new_message',
                title: 'New Message',
                message: `${user.fullName}: ${text ? text.substring(0, 50) : 'Sent an attachment'}`,
                entityId: conversationId,
                entityType: 'conversation'
              });
            }
          });
        }

        if (typeof callback === 'function') {
          callback({ success: true, data: message });
        }
      } catch (err) {
        console.error('[send_message] Error:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Message read
    socket.on('message_read', async ({ conversationId }) => {
      try {
        await messageService.markAsRead(user._id, conversationId);
        socket.to(`conversation:${conversationId}`).emit('message_read', {
          conversationId,
          userId: user._id
        });
      } catch (err) {
        console.error('[message_read] Error:', err);
      }
    });

    socket.on('disconnect', () => {
      // automatically leaves joined rooms
    });
  });

  return io;
};

const getIO = () => globalIO;

module.exports = {
  initSocket,
  getIO
};

