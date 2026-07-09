import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api/api";

import {
  FaSearch,
  FaEnvelope,
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaSpinner,
  FaArrowLeft
} from "react-icons/fa";

function CandidateMessages() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const myEmail = localStorage.getItem("email");

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    // If we came from a recruiter page with a recruiter to message
    const state = location.state;
    if (state && state.recruiterEmail) {
      startConversationWithRecruiter(state.recruiterEmail, state.recruiterName);
    }
  }, [location]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  // --- 2. REAL-TIME POLLING (Every 5 seconds) ---
  useEffect(() => {
    if (!selectedConversation) return;

    const intervalId = setInterval(() => {
      // Only poll if the chat is open to save bandwidth
      if (selectedConversation) {
        loadMessages(selectedConversation, true); // 'true' means silent update
      }
    }, 5000); // 5000ms = 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [selectedConversation]);

  // --- 3. SCROLL TO BOTTOM ---
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // --- API FUNCTIONS ---

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/messages/users/${myEmail}`);
      const formattedConvs = response.data.map((user) => ({
        _id: user.email,
        name: user.name || "Recruiter",
        email: user.email,
        role: user.role || "Recruiter",
        lastMessage: user.lastMessage || "Start a conversation",
        lastMessageTime: user.lastMessageTime || new Date().toISOString(),
        unreadCount: user.unreadCount || 0
      }));
      setConversations(formattedConvs);
      if (formattedConvs.length > 0 && !selectedConversation) {
        setSelectedConversation(formattedConvs[0]);
      }
    } catch (error) {
      console.log("Error loading conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation, isSilent = false) => {
    if (!conversation) return;
    if (!isSilent) setLoadingMessages(true); // Only show spinner on first load, not on polling
    
    try {
      const res = await API.get(`/messages/${myEmail}/${conversation.email}`);
      const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // If messages length changed (new message received), update the UI
      if (sorted.length !== messages.length || !isSilent) {
        setMessages(sorted);
        
        // Optional: Update unread badge if a new message arrives from recruiter
        const lastMsg = sorted[sorted.length - 1];
        if (lastMsg && lastMsg.sender !== myEmail) {
          setConversations(prev => prev.map(conv => {
            if (conv._id === conversation._id) {
              return { ...conv, unreadCount: (conv.unreadCount || 0) + 1, lastMessage: lastMsg.message, lastMessageTime: lastMsg.timestamp };
            }
            return conv;
          }));
        }
      }
    } catch (err) {
      if (!isSilent) console.log("Error loading messages:", err);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  const startConversationWithRecruiter = async (recruiterEmail, recruiterName) => {
    try {
      const existingConv = conversations.find(c => c.email === recruiterEmail);
      if (existingConv) {
        setSelectedConversation(existingConv);
        return;
      }

      // Create local conversation
      const newConv = {
        _id: recruiterEmail,
        name: recruiterName || "Recruiter",
        email: recruiterEmail,
        role: "Recruiter",
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv);
    } catch (error) {
      console.log("Error starting conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const msgText = newMessage;
      // Optimistic UI Update: Add message immediately
      const sentMessage = {
        _id: `msg_${Date.now()}`,
        sender: myEmail,
        message: msgText,
        timestamp: new Date().toISOString(),
        status: "sent"
      };
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");

      // Update sidebar last message
      setConversations(prev => prev.map(conv => 
        conv._id === selectedConversation._id 
          ? { ...conv, lastMessage: msgText, lastMessageTime: new Date().toISOString() } 
          : conv
      ));

      // Send to Backend
      await API.post("/messages/send", {
        sender: myEmail,
        receiver: selectedConversation.email,
        message: msgText
      });

      // Reload real messages from DB to ensure IDs/Status are correct
      await loadMessages(selectedConversation);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (error) {
      console.log("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- HELPERS ---

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateDivider = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const filteredConversations = conversations.filter(conv => {
    const search = searchTerm.toLowerCase();
    return (conv.name || "").toLowerCase().includes(search) ||
           (conv.lastMessage || "").toLowerCase().includes(search);
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sent': return <FaCheck className="cand-chat-status-icon sent" />;
      case 'delivered': return <FaCheckDouble className="cand-chat-status-icon delivered" />;
      case 'read': return <FaCheckDouble className="cand-chat-status-icon read" />;
      default: return <FaClock className="cand-chat-status-icon" />;
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', flexDirection:'column'}}>
          <FaSpinner className="spin" style={{fontSize:'32px', color:'#e67e22', marginBottom:'15px'}} />
          <p style={{color:'#718096'}}>Loading conversations...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="cand-msg-container">
        
        {/* SIDEBAR */}
        <div className="cand-msg-sidebar">
          <div className="cand-msg-sidebar-header">
            <div className="cand-msg-sidebar-top">
              <h2><FaEnvelope /> Messages</h2>
            </div>
            <div className="cand-msg-sidebar-search">
              <FaSearch className="cand-msg-sidebar-search-icon" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="cand-msg-conv-list">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`cand-msg-conv-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="cand-msg-conv-avatar">{getInitial(conv.name)}</div>
                  <div className="cand-msg-conv-info">
                    <div className="cand-msg-conv-top">
                      <span className="cand-msg-conv-name">{conv.name}</span>
                      <span className="cand-msg-conv-time">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <div className="cand-msg-conv-bottom">
                      <span className="cand-msg-conv-msg">{conv.lastMessage}</span>
                      {conv.unreadCount > 0 && <span className="cand-msg-conv-badge">{conv.unreadCount}</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{textAlign:'center', padding:'40px 20px', color:'#718096'}}>
                <FaEnvelope style={{fontSize:'40px', color:'#e2e8f0', marginBottom:'10px'}} />
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="cand-chat-area">
          {selectedConversation ? (
            <>
              <div className="cand-chat-header">
                <div className="cand-chat-user-info">
                  <div className="cand-chat-user-avatar">{getInitial(selectedConversation.name)}</div>
                  <div className="cand-chat-user-text">
                    <span className="cand-chat-user-name">{selectedConversation.name}</span>
                    <span className="cand-chat-user-role">{selectedConversation.role}</span>
                  </div>
                </div>
                <div className="cand-chat-actions">
                  <FaPhone /> <FaVideo /> <FaEllipsisV />
                </div>
              </div>

              <div className="cand-chat-msg-list">
                {loadingMessages ? (
                  <div style={{textAlign:'center', color:'#718096', padding:'40px'}}><FaSpinner className="spin" /> Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isSender = msg.sender === myEmail;
                    const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
                    return (
                      <div key={msg._id}>
                        {showDate && <div className="cand-chat-date-divider"><span>{formatDateDivider(msg.timestamp)}</span></div>}
                        <div className={`cand-chat-msg-row ${isSender ? 'sent' : 'received'}`}>
                          <div className="cand-chat-msg-bubble">{msg.message}</div>
                          <div className="cand-chat-msg-time">
                            {formatTime(msg.timestamp)}
                            {isSender && getStatusIcon(msg.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{textAlign:'center', color:'#718096', padding:'40px'}}>
                    <FaEnvelope style={{fontSize:'40px', color:'#e2e8f0', marginBottom:'10px'}} />
                    <p>No messages yet</p>
                    <p style={{fontSize:'13px'}}>Start the conversation by sending a message</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="cand-chat-input-area">
                <div className="cand-chat-input-wrapper">
                  <FaPaperclip />
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyDown={handleKeyPress}
                  />
                  <FaSmile />
                </div>
                <button className="cand-chat-send-btn" onClick={sendMessage} disabled={!newMessage.trim() || sending}>
                  {sending ? <FaSpinner className="spin" /> : <><FaPaperPlane /> Send</>}
                </button>
              </div>
            </>
          ) : (
            <div className="cand-chat-empty">
              <FaEnvelope />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default CandidateMessages;