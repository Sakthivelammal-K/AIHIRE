import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api/api";
import EmojiPicker from "emoji-picker-react";

import {
  FaSearch,
  FaEnvelope,
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaEllipsisV,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaSpinner,
  FaArrowLeft,
  FaCopy,
  FaTrashAlt,
  FaArchive,
  FaFilter,
  FaFileAlt,
  FaDownload,
  FaTimes
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
  
  const [view, setView] = useState("inbox");
  const [filter, setFilter] = useState("all");
  
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // --- STATES FOR ATTACHMENT & EMOJI & VIEWER ---
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewerFile, setViewerFile] = useState(null);

  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const isUploadingRef = useRef(false);

  const myEmail = localStorage.getItem("email");

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // THE SINGLE DATA FETCHER (NO HARDCODED FALLBACKS)
  // ==========================================
  const fetchAllData = async () => {
    if (isUploadingRef.current) return;
    try {
      // 1. Always fetch the sidebar (this populates the list with real users from backend)
      const sidebarRes = await API.get(`/messages/users/${myEmail}`);
      setConversations(sidebarRes.data);

      // 2. If a chat is open, fetch those specific messages
      if (selectedConversation) {
        const msgRes = await API.get(`/messages/${myEmail}/${selectedConversation.email}`);
        const sorted = msgRes.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sorted);
        // Auto-scroll
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- INITIAL LOAD & POLLING ---
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation, myEmail]);

  // --- CLICK TO SELECT CHAT ---
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  // ==========================================
  // SENDING MESSAGES
  // ==========================================
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);

    try {
      const msgText = newMessage;
      const tempMsg = {
        _id: `temp_${Date.now()}`,
        sender: myEmail,
        message: msgText,
        timestamp: new Date().toISOString(),
        status: "sent"
      };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage("");

      await API.post("/messages/send", {
        sender: myEmail,
        receiver: selectedConversation.email,
        message: msgText
      });

      // Quick fetch to update server state
      await fetchAllData();
    } catch (error) {
      console.log("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  // --- EMOJI & ATTACHMENT LOGIC ---
  const handleAttachmentClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSending(true);
    isUploadingRef.current = true;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", myEmail);
    formData.append("receiver", selectedConversation.email);

    try {
      const res = await API.post("/messages/upload", formData);
      if (res.data?.fileUrl) {
        await API.post("/messages/send", {
          sender: myEmail,
          receiver: selectedConversation.email,
          message: res.data.fileUrl
        });
        await fetchAllData();
      }
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setSending(false);
      isUploadingRef.current = false;
      e.target.value = null;
    }
  };

  const onEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji || emojiData.character || emojiData;
    if (emoji) setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- CHAT ACTIONS ---
  const handleCopyChat = () => {
    const chatText = messages.map(m => `${m.sender}: ${m.message}`).join('\n');
    navigator.clipboard.writeText(chatText).then(() => alert("Chat copied to clipboard!"));
    setShowDropdown(false);
  };

  const handleDeleteChat = async () => {
    if (window.confirm("Delete this conversation?")) {
      try {
        await API.delete(`/messages/conversation/${selectedConversation._id}`, { data: { myEmail: myEmail } });
        setConversations(prev => prev.filter(c => c._id !== selectedConversation._id));
        setSelectedConversation(null);
      } catch (error) { console.log("Error deleting conversation:", error); }
    }
  };

  const handleArchiveChat = () => {
    setConversations(prev => prev.map(conv => 
      conv._id === selectedConversation._id ? { ...conv, isArchived: !conv.isArchived } : conv
    ));
    setSelectedConversation(null);
  };

  // --- HELPERS ---
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try { return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); } 
    catch (e) { return ""; }
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  // === FILTERING LOGIC ===
  const viewFiltered = conversations.filter(conv => {
    if (view === 'inbox') return !conv.isArchived;
    if (view === 'archived') return conv.isArchived;
    return true;
  });
  const searchFiltered = viewFiltered.filter(conv => {
    const search = searchTerm.toLowerCase();
    return (conv.name || "").toLowerCase().includes(search) || (conv.lastMessage || "").toLowerCase().includes(search);
  });
  const finalFilteredConversations = searchFiltered.filter(conv => {
    if (filter === "unread") return conv.unreadCount > 0;
    if (filter === "read") return conv.unreadCount === 0;
    return true;
  });

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
              <h2><FaEnvelope style={{color:'#e67e22'}} /> Messages</h2>
            </div>
            
            <div className="cand-msg-sidebar-tabs-container">
              <button 
                className={`cand-msg-sidebar-tab-btn ${view === 'inbox' ? 'active' : ''}`} 
                onClick={() => { setView('inbox'); setFilter('all'); }}
              >
                Inbox
              </button>
              <button 
                className={`cand-msg-sidebar-tab-btn ${view === 'archived' ? 'active' : ''}`} 
                onClick={() => { setView('archived'); setFilter('all'); }}
              >
                Archived
              </button>
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

            <div className="cand-msg-sidebar-actions">
               <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                  <span className="cand-msg-sidebar-actions-left">
                    <FaFilter style={{color:'#e67e22', fontSize:'12px'}} /> Filters
                  </span>
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    style={{padding:'4px 8px', borderRadius:'4px', border:'1px solid #e2e8f0', outline:'none', fontSize:'12px', cursor:'pointer'}}
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="cand-msg-conv-list">
            {finalFilteredConversations.length > 0 ? (
              finalFilteredConversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`cand-msg-conv-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
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
                <p>{view === 'inbox' ? 'No active conversations found' : 'No archived conversations found'}</p>
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
                  <FaArrowLeft 
                    onClick={() => setSelectedConversation(null)} 
                    style={{cursor:'pointer', marginRight:'16px', color:'#64748b', fontSize:'18px'}} 
                  />
                  
                  <div className="cand-chat-user-avatar">
                    {getInitial(selectedConversation.name)}
                  </div>
                  <div className="cand-chat-user-text">
                    <span className="cand-chat-user-name">{selectedConversation.name}</span>
                    <span className="cand-chat-user-role">{selectedConversation.role}</span>
                  </div>
                </div>
                
                <div className="cand-chat-header-actions" style={{position:'relative'}}>
                  
                  <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
                    <span 
                      onClick={() => setShowDropdown(!showDropdown)} 
                      style={{ cursor: 'pointer', fontSize: '18px', color: '#94a3b8' }}
                    >
                      <FaEllipsisV />
                    </span>
                    
                    {showDropdown && (
                      <div className="cand-chat-dropdown">
                        <div className="cand-chat-dropdown-item" onClick={handleCopyChat}>
                          <FaCopy /> Copy Chat
                        </div>
                        <div className="cand-chat-dropdown-item" onClick={handleArchiveChat}>
                          <FaArchive /> {selectedConversation.isArchived ? 'Unarchive Chat' : 'Archive Chat'}
                        </div>
                        <div className="cand-chat-dropdown-item delete" onClick={handleDeleteChat}>
                          <FaTrashAlt /> Delete Chat
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="cand-chat-msg-list">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isSender = msg.sender === myEmail;
                    const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
                    const isImage = msg.message && msg.message.match(/\.(jpeg|jpg|gif|png)$/i);

                    return (
                      <div key={msg._id}>
                        {showDate && (
                          <div className="cand-chat-date-divider"><span>{new Date(msg.timestamp).toLocaleDateString()}</span></div>
                        )}
                        <div className={`cand-chat-msg-row ${isSender ? 'sent' : 'received'}`}>
                          
                          {!isSender && (
                            <span className="cand-chat-sender-name">{selectedConversation.name}</span>
                          )}

                          <div className="cand-chat-msg-bubble">
                            {isImage ? (
                              <img src={msg.message} alt="Attached" className="max-w-full h-auto rounded" />
                            ) : (
                              <span>{msg.message}</span>
                            )}
                          </div>
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
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   style={{ display: 'none' }} 
                   onChange={handleFileChange} 
                 />

                <div className="cand-chat-input-wrapper">
                  <FaPaperclip 
                    className="cand-chat-input-icon" 
                    onClick={handleAttachmentClick} 
                    style={{ cursor: 'pointer' }}
                  />
                  
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyDown={handleKeyPress}
                  />

                  <div style={{ position: 'relative' }}>
                    <FaSmile 
                      className="cand-chat-input-icon" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                      style={{ cursor: 'pointer' }}
                    />
                    
                    {showEmojiPicker && (
                      <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '35px', right: '0px', zIndex: 100 }}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                  </div>

                </div>
                <button className="cand-chat-send-btn" onClick={sendMessage} disabled={!newMessage.trim() || sending}>
                  {sending ? <FaSpinner className="spin" /> : <><FaPaperPlane /> Send</>}
                </button>
              </div>
            </>
          ) : (
            <div className="cand-chat-empty">
              <FaEnvelope style={{fontSize:'60px', color:'#e2e8f0', marginBottom:'20px'}} />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>

      </div>

      {/* ========================================== */}
      {/* FILE VIEWER OVERLAY */}
      {/* ========================================== */}
      {viewerFile && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setViewerFile(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewerFile(null)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              <FaTimes />
            </button>

            {viewerFile.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) ? (
              <img 
                src={viewerFile} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px', objectFit: 'contain' }} 
              />
            ) : (
              <iframe 
                src={viewerFile} 
                style={{ width: '80vw', height: '80vh', border: 'none', borderRadius: '4px' }} 
                title="File Preview"
              />
            )}
            
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
export default CandidateMessages;
