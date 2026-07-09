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
  FaRegStar,
  FaStar,
  FaEllipsisV,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaSpinner,
  FaArrowLeft,
  FaPlus,
  FaUserPlus,
  FaTimes,
  FaFile,
  FaCalendarAlt,
  FaDownload,
  FaLinkedin,
  FaMapMarkerAlt,
  FaFilter,
  FaCopy,
  FaTrashAlt,
  FaArchive
} from "react-icons/fa";

function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for Tabs and Filters
  const [view, setView] = useState("inbox"); // 'inbox' or 'archived'
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [availableCandidates, setAvailableCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [applications, setApplications] = useState([]);
  
  // Chat Action States
  const [isStarred, setIsStarred] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const messagesEndRef = useRef(null);
  const myEmail = localStorage.getItem("email");

  // Responsive & Click Outside handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (mobile) setShowSidebar(true);
    };
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load data on mount
  useEffect(() => {
    loadConversations();
    loadCandidates();
  }, []);

  // Handle navigation state
  useEffect(() => {
    const state = location.state;
    if (state && state.candidateId) {
      startConversationWithCandidate(state.candidateId, state.candidateName, state.candidateEmail);
    }
  }, [location]);

  // Load messages when conversation changes & reset actions
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      setIsStarred(false); 
      setShowDropdown(false);
      
      // Mark conversation as read when you open it
      setConversations(prev => prev.map(conv => 
        conv._id === selectedConversation._id 
          ? { ...conv, unreadCount: 0 } 
          : conv
      ));
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  // Scroll to bottom
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
      // Add an 'isArchived' property to handle the archive tab (default false)
      const dataWithArchive = response.data.map(conv => ({
        ...conv,
        isArchived: false 
      }));
      setConversations(dataWithArchive);
    } catch (error) {
      console.log("Error loading conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation) => {
    if (!conversation) return;
    setLoadingMessages(true);
    try {
      const res = await API.get(`/messages/${myEmail}/${conversation.email}`);
      // Sort messages by date (newest at bottom)
      const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sorted);
    } catch (err) {
      console.log("Error loading messages:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadCandidates = async () => {
    try {
      if (applications.length > 0) {
        setAvailableCandidates(applications);
      } else {
        const response = await API.get("/applications/");
        const data = Array.isArray(response.data) ? response.data : response.data.applications || [];
        setAvailableCandidates(data);
        setApplications(data);
      }
    } catch (error) {
      console.log("Error loading candidates:", error);
      setAvailableCandidates([]);
    }
  };

  const startConversationWithCandidate = async (candidateId, candidateName, candidateEmail) => {
    setShowNewConversation(false);
    setSelectedCandidate(null);
    try {
      const existingConv = conversations.find(c => c.email === candidateEmail);
      if (existingConv) {
        setSelectedConversation(existingConv);
        if (isMobileView) setShowSidebar(false);
        return;
      }

      const newConv = {
        _id: candidateId,
        name: candidateName || "Candidate",
        email: candidateEmail,
        role: "Applicant",
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isArchived: false
      };
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv);
      if (isMobileView) setShowSidebar(false);
      
      // Reload official list from backend just in case
      try {
        const res = await API.get(`/messages/users/${myEmail}`);
        const dataWithArchive = res.data.map(conv => ({ ...conv, isArchived: false }));
        setConversations(dataWithArchive);
      } catch (e) { console.log(e); }
    } catch (error) {
      console.log("Error starting conversation:", error);
    }
  };

  const handleStartNewConversation = async () => {
    if (!showNewConversation) {
      setShowNewConversation(true);
      return;
    }
    if (!selectedCandidate) {
      alert("Please select a candidate");
      return;
    }
    await startConversationWithCandidate(
      selectedCandidate._id,
      selectedCandidate.candidateName || selectedCandidate.name,
      selectedCandidate.email
    );
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    try {
      // Optimistic UI Update
      const tempMsg = {
        _id: `temp_${Date.now()}`,
        sender: myEmail,
        message: newMessage,
        timestamp: new Date().toISOString(),
        status: "sent"
      };
      setMessages(prev => [...prev, tempMsg]);
      const msgText = newMessage;
      setNewMessage("");

      // Update sidebar
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

  // --- SPECIFIC BUTTON ACTIONS ---

  const handleStarToggle = () => {
    setIsStarred(!isStarred);
  };

  const handleCopyChat = () => {
    const chatText = messages.map(m => `${m.sender}: ${m.message}`).join('\n');
    navigator.clipboard.writeText(chatText);
    alert("Chat copied to clipboard!");
    setShowDropdown(false);
  };

  const handleDeleteChat = () => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      setConversations(prev => prev.filter(c => c._id !== selectedConversation._id));
      setSelectedConversation(null);
      setShowDropdown(false);
    }
  };

  const handleArchiveChat = () => {
    // Toggle the archive status for this conversation
    setConversations(prev => prev.map(conv => 
      conv._id === selectedConversation._id 
        ? { ...conv, isArchived: !conv.isArchived } 
        : conv
    ));
    setSelectedConversation(null);
    setShowDropdown(false);
  };

  // --- UI HELPERS ---

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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sent': return <FaCheck className="message-status-icon sent" />;
      case 'delivered': return <FaCheckDouble className="message-status-icon delivered" />;
      case 'read': return <FaCheckDouble className="message-status-icon read" />;
      default: return <FaClock className="message-status-icon" />;
    }
  };

  // --- FILTERING LOGIC (This is the fix) ---

  // Step 1: Filter by Inbox or Archived
  const viewFiltered = conversations.filter(conv => {
    if (view === 'inbox') return !conv.isArchived;
    if (view === 'archived') return conv.isArchived;
    return true;
  });

  // Step 2: Filter by Search term
  const searchFiltered = viewFiltered.filter(conv => {
    const search = searchTerm.toLowerCase();
    return (conv.name || "").toLowerCase().includes(search) ||
           (conv.role || "").toLowerCase().includes(search) ||
           (conv.lastMessage || "").toLowerCase().includes(search);
  });

  // Step 3: Filter by Read/Unread status
  const finalFilteredConversations = searchFiltered.filter(conv => {
    if (filter === "unread") return conv.unreadCount > 0;
    if (filter === "read") return conv.unreadCount === 0;
    return true; // all
  });

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const filteredCandidates = availableCandidates.filter(c => {
    const search = candidateSearch.toLowerCase();
    return ((c.candidateName || c.name || "") + (c.email || "")).toLowerCase().includes(search);
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
      <div className="messages-wrapper">
        
        {/* --- SIDEBAR (LEFT) --- */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-top-row">
              <h2><FaEnvelope style={{color:'#e67e22'}} /> Messages</h2>
              <button onClick={handleStartNewConversation} className="btn-new-message"><FaPlus /> New</button>
            </div>
            
            {/* WORKING TABS */}
            <div className="sidebar-tabs">
              <span 
                className={view === 'inbox' ? 'active' : ''} 
                onClick={() => { setView('inbox'); setShowNewConversation(false); }}
              >
                Inbox
              </span>
              <span 
                className={view === 'archived' ? 'active' : ''} 
                onClick={() => { setView('archived'); setShowNewConversation(false); }}
              >
                Archived
              </span>
            </div>

            <div className="sidebar-search">
              <FaSearch className="sidebar-search-icon" />
              <input type="text" placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="sidebar-actions">
               {/* WORKING FILTERS */}
               <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                  <span className="sidebar-actions-left"><FaFilter style={{color:'#e67e22', fontSize:'12px'}} /> Filters</span>
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

          {/* New Conversation Modal (Inline) */}
          {showNewConversation && (
            <div style={{padding:'15px', borderBottom:'1px solid #f0f2f5', background:'#f8f9fa'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                <span style={{fontWeight:'600', fontSize:'14px'}}>New Message</span>
                <button onClick={() => setShowNewConversation(false)} style={{background:'none', border:'none', cursor:'pointer', color:'#a0aec0'}}><FaTimes /></button>
              </div>
              <div style={{position:'relative', marginBottom:'10px'}}>
                <FaSearch style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'#a0aec0', fontSize:'12px'}} />
                <input type="text" placeholder="Search candidates..." value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} style={{width:'100%', padding:'8px 10px 8px 32px', border:'1px solid #e2e8f0', borderRadius:'6px', outline:'none', fontSize:'13px'}} />
              </div>
              <div style={{maxHeight:'150px', overflowY:'auto', background:'white', borderRadius:'6px', border:'1px solid #e2e8f0', marginBottom:'10px'}}>
                {filteredCandidates.length > 0 ? filteredCandidates.slice(0, 10).map(c => (
                  <div key={c._id} onClick={() => setSelectedCandidate(c)} style={{display:'flex', alignItems:'center', padding:'8px 12px', cursor:'pointer', background: selectedCandidate?._id === c._id ? '#fdf2e9' : 'transparent', borderBottom:'1px solid #f8f9fa'}}>
                    <div style={{width:'28px', height:'28px', borderRadius:'50%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'600', marginRight:'10px'}}>{getInitial(c.candidateName || c.name)}</div>
                    <div style={{flex:1, overflow:'hidden'}}>
                      <div style={{fontSize:'13px', fontWeight:'600', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.candidateName || c.name}</div>
                      <div style={{fontSize:'11px', color:'#718096', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.email}</div>
                    </div>
                    {selectedCandidate?._id === c._id && <FaCheck style={{color:'#e67e22'}} />}
                  </div>
                )) : <div style={{padding:'15px', textAlign:'center', color:'#a0aec0', fontSize:'13px'}}>No candidates found</div>}
              </div>
              <button onClick={handleStartNewConversation} disabled={!selectedCandidate} style={{width:'100%', padding:'8px', border:'none', borderRadius:'6px', background: selectedCandidate ? '#e67e22' : '#e2e8f0', color:'white', cursor: selectedCandidate ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontSize:'13px'}}><FaPaperPlane /> Start</button>
            </div>
          )}

          <div className="conversation-list">
            {finalFilteredConversations.length > 0 ? finalFilteredConversations.map(conv => (
              <div key={conv._id} onClick={() => { setSelectedConversation(conv); if (isMobileView) setShowSidebar(false); setShowNewConversation(false); }} className={`conv-item ${selectedConversation?._id === conv._id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}>
                <div className="conv-avatar">
                  {conv.profileImage ? <img src={conv.profileImage} alt="avatar" /> : getInitial(conv.name)}
                </div>
                <div className="conv-info">
                  <div className="conv-top">
                    <span className="conv-name">{conv.name}</span>
                    <span className="conv-time">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <div className="conv-bottom">
                    <span className="conv-msg">{conv.lastMessage}</span>
                    {conv.unreadCount > 0 && <span className="conv-badge">{conv.unreadCount}</span>}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{textAlign:'center', padding:'40px 20px', color:'#718096'}}>
                <FaEnvelope style={{fontSize:'40px', color:'#e2e8f0', marginBottom:'10px'}} />
                <p>{view === 'inbox' ? 'No active conversations found' : 'No archived conversations found'}</p>
              </div>
            )}
          </div>
        </div>

        {/* --- CHAT AREA (MIDDLE - EXPANDED) --- */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  {isMobileView && <FaArrowLeft onClick={() => setSelectedConversation(null)} style={{cursor:'pointer'}} />}
                  <div className="chat-user-avatar">
                    {selectedConversation.profileImage ? <img src={selectedConversation.profileImage} alt="avatar" /> : getInitial(selectedConversation.name)}
                  </div>
                  <div className="chat-user-text">
                     <span className="chat-user-name">{selectedConversation.name}</span>
                     <span className="chat-user-role">{selectedConversation.role}</span>
                  </div>
                </div>
                
                <div className="chat-header-actions" style={{position:'relative'}}>
                   <span onClick={handleStarToggle}>
                     {isStarred ? <FaStar className="starred" /> : <FaRegStar />}
                   </span>
                   
                   <span onClick={() => setShowDropdown(!showDropdown)} ref={dropdownRef}>
                     <FaEllipsisV />
                     {showDropdown && (
                       <div className="action-dropdown" ref={dropdownRef}>
                         <div onClick={handleCopyChat}><FaCopy /> Copy Chat</div>
                         <div onClick={handleArchiveChat} className="archive">
                           {selectedConversation.isArchived ? <FaArchive /> : <FaArchive />} 
                           {selectedConversation.isArchived ? ' Unarchive' : ' Archive Chat'}
                         </div>
                         <div onClick={handleDeleteChat} className="delete"><FaTrashAlt /> Delete Chat</div>
                       </div>
                     )}
                   </span>
                </div>
              </div>

              <div className="chat-messages-list">
                {loadingMessages ? (
                  <div style={{textAlign:'center', color:'#718096', padding:'40px'}}><FaSpinner className="spin" /> Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isRecruiter = msg.sender === myEmail;
                    const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
                    return (
                      <div key={msg._id}>
                        {showDate && <div className="date-divider"><span>{formatDateDivider(msg.timestamp)}</span></div>}
                        <div className={`msg-row ${isRecruiter ? 'sent' : 'received'}`}>
                          <div className="msg-bubble">
                            {!isRecruiter && <span className="msg-sender-name">{selectedConversation.name}</span>}
                            {msg.message}
                          </div>
                          <div className="msg-footer">
                            {formatTime(msg.timestamp)}
                            {isRecruiter && getStatusIcon(msg.status)}
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

              <div className="chat-input-area">
                 <div className="chat-input-wrapper">
                    <FaPaperclip />
                    <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} />
                    <FaSmile />
                 </div>
                 <button className="btn-send" onClick={sendMessage} disabled={!newMessage.trim() || sending}>
                    {sending ? <FaSpinner className="spin" /> : <><FaPaperPlane /> Send</>}
                 </button>
              </div>
            </>
          ) : (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#a0aec0'}}>
              <FaEnvelope style={{fontSize:'60px', marginBottom:'20px', color:'#e2e8f0'}} />
              <h3 style={{color:'#4a5568', fontWeight:'600'}}>Select a conversation</h3>
              <p style={{fontSize:'14px', margin:0}}>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Messages;