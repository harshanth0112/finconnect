import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getConversations,
  startConversation,
  getMessages,
  markConversationRead
} from '../../services/messageService';
import { getSocket } from '../../services/socket';
import {
  MessageSquare,
  Send,
  User as UserIcon,
  Search,
  CheckCheck,
  Check,
  Paperclip,
  Image as ImageIcon,
  Clock,
  ShieldCheck
} from 'lucide-react';
import PageLoader from '../../lazy/PageLoader';

const Messaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket & fetch conversations
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        setLoading(true);
        if (user) {
          const token = await user.getIdToken();
          socketRef.current = getSocket(token);

          // Socket event listeners
          socketRef.current.on('receive_message', (newMsg) => {
            if (activeConversation && newMsg.conversation === activeConversation._id) {
              setMessages((prev) => {
                if (prev.some((m) => m._id === newMsg._id)) return prev;
                return [...prev, newMsg];
              });
              // Mark as read
              socketRef.current.emit('message_read', { conversationId: activeConversation._id });
            }
            // Update lastMessage in conversations list
            setConversations((prev) =>
              prev.map((c) =>
                c._id === newMsg.conversation
                  ? { ...c, lastMessage: newMsg, lastMessageAt: newMsg.createdAt }
                  : c
              ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
            );
          });

          socketRef.current.on('typing_start', ({ conversationId, fullName }) => {
            if (activeConversation?._id === conversationId) {
              setTypingUser(fullName);
            }
          });

          socketRef.current.on('typing_stop', ({ conversationId }) => {
            if (activeConversation?._id === conversationId) {
              setTypingUser(null);
            }
          });
        }

        const data = await getConversations();
        if (isMounted) {
          setConversations(data);
          if (data.length > 0) {
            setActiveConversation(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off('receive_message');
        socketRef.current.off('typing_start');
        socketRef.current.off('typing_stop');
      }
    };
  }, [user]);

  // Handle active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    let isMounted = true;
    const fetchChatMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await getMessages(activeConversation._id);
        if (isMounted && res?.messages) {
          setMessages(res.messages);
        }

        // Join socket room
        if (socketRef.current) {
          socketRef.current.emit('join_conversation', {
            conversationId: activeConversation._id
          });
          socketRef.current.emit('message_read', {
            conversationId: activeConversation._id
          });
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchChatMessages();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.emit('leave_conversation', {
          conversationId: activeConversation._id
        });
      }
    };
  }, [activeConversation]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Handle Input typing status
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (!socketRef.current || !activeConversation) return;

    socketRef.current.emit('typing_start', { conversationId: activeConversation._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing_stop', { conversationId: activeConversation._id });
    }, 1500);
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    const payload = {
      conversationId: activeConversation._id,
      text: inputMessage.trim()
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', payload, (res) => {
        if (res && !res.success) {
          console.error('Failed to deliver message via socket:', res.error);
        }
      });
    }

    setInputMessage('');
    if (socketRef.current) {
      socketRef.current.emit('typing_stop', { conversationId: activeConversation._id });
    }
  };

  // Helper to get conversation partner
  const getPartner = (conv) => {
    return conv.participants?.find((p) => p.email !== user?.email) || conv.participants?.[0];
  };

  const filteredConversations = conversations.filter((c) => {
    const partner = getPartner(c);
    return partner?.fullName?.toLowerCase().includes(searchFilter.toLowerCase());
  });

  if (loading) {
    return <PageLoader message="Loading messages & conversations..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[750px]">
        {/* Left Side: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-sky-600" />
              Messages
            </h2>
            <div className="mt-3 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const partner = getPartner(conv);
                const isActive = activeConversation?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full text-left p-3.5 flex items-start space-x-3 transition hover:bg-sky-50/60 ${
                      isActive ? 'bg-sky-50 border-l-4 border-sky-600' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
                      {partner?.profileImage ? (
                        <img
                          src={partner.profileImage}
                          alt={partner.fullName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        partner?.fullName?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {partner?.fullName || 'User'}
                        </h4>
                        {conv.lastMessageAt && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-sky-700 font-medium block truncate">
                        {partner?.accountType?.replace('_', ' ')}
                      </span>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {conv.lastMessage?.text || 'Started a conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Chat Pane */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const partner = getPartner(activeConversation);
                  return (
                    <>
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm overflow-hidden">
                        {partner?.profileImage ? (
                          <img
                            src={partner.profileImage}
                            alt={partner.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          partner?.fullName?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center">
                          {partner?.fullName}
                        </h3>
                        <p className="text-[11px] text-gray-500 capitalize">
                          {partner?.accountType?.replace('_', ' ')}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/40">
              {loadingMessages ? (
                <div className="text-center py-8 text-xs text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-gray-400">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  Say hello to begin collaborating in finance!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender?._id === user?._id || msg.sender?.email === user?.email;

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs ${
                          isMe
                            ? 'bg-sky-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div
                          className={`mt-1 flex items-center justify-end space-x-1 text-[9px] ${
                            isMe ? 'text-sky-200' : 'text-gray-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {isMe && (
                            <CheckCheck className="w-3 h-3 text-sky-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {typingUser && (
                <div className="flex items-center text-xs text-gray-400 italic">
                  <span className="animate-pulse">{typingUser} is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-white">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 text-sm">Select a conversation</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Choose an existing chat from the left panel or initiate a connection to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;

