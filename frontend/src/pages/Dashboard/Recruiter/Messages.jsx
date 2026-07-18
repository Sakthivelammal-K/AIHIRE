import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api/api";
import EmojiPicker from "emoji-picker-react";

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
  FaArchive,
  FaFileAlt
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
  
  const [view, setView] = useState("inbox");
  const [filter, setFilter] = useState("all");
  
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [availableCandidates, setAvailableCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [applications, setApplications] = useState([]);
  
  const [showDropdown, setShowDropdown] = useState(false);

  // 🟢 ADD THESE NEW STATES:
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templatesList, setTemplatesList] = useState([]);

  // --- STATES FOR ATTACHMENT & EMOJI & VIEWER ---
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewerFile, setViewerFile] = useState(null);
  
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const isUploadingRef = useRef(false);

  const myEmail = localStorage.getItem("email");

  // Responsive & Click Outside handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (mobile) setShowSidebar(true);
    };
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) setShowEmojiPicker(false);
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

  // ==========================================
  // LOAD MESSAGES & SIDEBAR
  // ==========================================
  const loadMessages = useCallback(async (conversation) => {
    if (!conversation) return;
    setLoadingMessages(true);
    try {
      const res = await API.get(`/messages/${myEmail}/${conversation.email}`);
      const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sorted);
      if (sorted.length > 0) {
        const lastMsg = sorted[sorted.length - 1];
        setConversations(prev => prev.map(conv => 
          conv._id === conversation._id ? { ...conv, lastMessage: lastMsg.message, lastMessageTime: lastMsg.timestamp } : conv
        ));
      }
    } catch (err) { console.log("Error loading messages:", err); setMessages([]); } 
    finally { setLoadingMessages(false); }
  }, [myEmail]);

  // ==========================================
  // REMOVED Auto-Mark Read! 
  // ==========================================
  const markMessagesAsRead = useCallback(async (conversation) => {
    try { await API.put("/messages/read", { sender: conversation.email, receiver: myEmail }); } 
    catch (err) { console.log("Error marking messages as read:", err); }
  }, [myEmail]);

  // Load messages ONLY when user clicks on the left
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      setShowDropdown(false);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, loadMessages]);

  // AUTO-SCROLL
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ==========================================
  // LOAD SIDEBAR (Completely Dynamic)
  // ==========================================
  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/messages/users/${myEmail}`);
      let data = response.data.map(conv => ({ ...conv, isArchived: false }));
      setConversations(data);
    } catch (error) { console.log("Error loading conversations:", error); setConversations([]); } 
    finally { setLoading(false); }
  };

  // ==========================================
  // POLLING: Real-Time Sync
  // ==========================================
  useEffect(() => {
    if (!selectedConversation) return;

    const intervalId = setInterval(() => {
      if (selectedConversation) {
        const forceSyncSidebar = async () => {
          if (isUploadingRef.current) return; 

          try {
            // Fetch sidebar data
            const sidebarRes = await API.get(`/messages/users/${myEmail}`);
            
            if (sidebarRes.data && sidebarRes.data.length > 0) {
              const updatedSidebar = sidebarRes.data.map(conv => ({ ...conv, isArchived: false }));
              setConversations(updatedSidebar);
            }

            // Then update the chat messages
            const res = await API.get(`/messages/${myEmail}/${selectedConversation.email}`);
            const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            if (sorted.length > 0 && messages.length > 0) {
               const latestDb = sorted[sorted.length - 1];
               const latestState = messages[messages.length - 1];
               if (latestDb._id === latestState._id) return;
            }

            if (sorted.length !== messages.length) {
              setMessages(sorted);
            }

            if (sorted.length > 0) {
              const lastMsg = sorted[sorted.length - 1];
              const unreadCount = sorted.filter(msg => 
                msg.sender !== myEmail && msg.read === false
              ).length;

              setConversations(prev => prev.map(conv => 
                conv._id === selectedConversation._id 
                  ? { 
                      ...conv, 
                      lastMessage: lastMsg.message, 
                      lastMessageTime: lastMsg.timestamp,
                      unreadCount: unreadCount 
                    } 
                  : conv
              ));
            }
          } catch (err) { console.log("Error syncing sidebar:", err); }
        };

        forceSyncSidebar();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedConversation, messages, myEmail]);

  // --- API FUNCTIONS ---

  const loadCandidates = async () => {
    try {
      if (applications.length > 0) {
        setAvailableCandidates(applications);
      } else {
        const response = await API.get("/applications/");
        const data = Array.isArray(response.data) ? response.data : response.data.applications || [];
        setApplications(data);
        const uniqueCandidates = [];
        const seenEmails = new Set();
        data.forEach(candidate => {
          const email = candidate.email;
          if (!seenEmails.has(email)) { seenEmails.add(email); uniqueCandidates.push(candidate); }
        });
        setAvailableCandidates(uniqueCandidates);
      }
    } catch (error) { console.log("Error loading candidates:", error); setAvailableCandidates([]); }
  };

  const startConversationWithCandidate = async (candidateId, candidateName, candidateEmail) => {
    setShowNewConversation(false); setSelectedCandidate(null);
    try {
      const existingConv = conversations.find(c => c.email === candidateEmail);
      if (existingConv) { setSelectedConversation(existingConv); if (isMobileView) setShowSidebar(false); return; }
      const newConv = { _id: candidateId, name: candidateName || "Candidate", email: candidateEmail, role: "Applicant", lastMessage: "", lastMessageTime: new Date().toISOString(), unreadCount: 0, isArchived: false };
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv);
      if (isMobileView) setShowSidebar(false);
    } catch (error) { console.log("Error starting conversation:", error); }
  };

  const handleStartNewConversation = async () => {
    if (!showNewConversation) { setShowNewConversation(true); return; }
    if (!selectedCandidate) { alert("Please select a candidate"); return; }
    await startConversationWithCandidate(selectedCandidate._id, selectedCandidate.candidateName || selectedCandidate.name, selectedCandidate.email);
  };

  // ==========================================
  // EMOJI & ATTACHMENT LOGIC
  // ==========================================
  
  const handleAttachmentClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };

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
      const res = await API.post("/messages/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data && res.data.fileUrl) {
        await sendFileMessage(res.data.fileUrl, file.type, file.name);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setNewMessage(prev => prev + ` 📎 ${file.name}`);
      alert("Upload failed. Sending as text instead.");
    } finally {
      setSending(false);
      isUploadingRef.current = false;
      e.target.value = null;
    }
  };

  const sendFileMessage = async (fileUrl, fileType, fileName) => {
    if (!selectedConversation) return;
    try {
      const timestamp = new Date().toISOString();
      const tempMsg = {
        _id: `file_${Date.now()}`,
        sender: myEmail,
        message: fileUrl,
        type: fileType && fileType.startsWith('image/') ? 'image' : 'file', 
        originalName: fileName,
        timestamp: timestamp,
        status: "sent"
      };
      setMessages(prev => [...prev, tempMsg]);
      setConversations(prev => prev.map(conv => 
        conv._id === selectedConversation._id ? { ...conv, lastMessage: '📎 File Attached', lastMessageTime: timestamp, unreadCount: 0 } : conv
      ));

      await API.post("/messages/send", { sender: myEmail, receiver: selectedConversation.email, message: fileUrl });
    } catch (error) { console.log("Error sending file message:", error); }
  };

  const onEmojiClick = (emojiData, event) => {
    const emoji = emojiData.emoji || emojiData.character || emojiData;
    if (emoji) setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // ==========================================
  // 🟢 NEW: TEMPLATE INTEGRATION
  // ==========================================
  const loadTemplatesForChat = async () => {
    try {
      const res = await API.get("/templates?type=email");
      if (res.data) {
        setTemplatesList(res.data);
        setShowTemplatePicker(true);
      }
    } catch (error) {
      console.log("Error loading templates for chat:", error);
    }
  };

  const insertTemplate = (template) => {
    // Replace newline characters so they display correctly in a textarea
    const formattedBody = template.body.replace(/\\n/g, '\n');
    
    // Try to auto-replace {candidate_name} with the actual candidate's name
    const finalBody = formattedBody.replace(/{candidate_name}/g, selectedConversation?.name || "Candidate");
    
    // Pre-fill the message box with Subject + Body
    setNewMessage(`${template.subject}\n\n${finalBody}`);
    setShowTemplatePicker(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    try {
      const msgText = newMessage;
      const timestamp = new Date().toISOString();
      const tempMsg = { _id: `temp_${Date.now()}`, sender: myEmail, message: msgText, timestamp: timestamp, status: "sent" };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage("");
      setConversations(prev => prev.map(conv => conv._id === selectedConversation._id ? { ...conv, lastMessage: msgText, lastMessageTime: timestamp, unreadCount: 0 } : conv));
      await API.post("/messages/send", { sender: myEmail, receiver: selectedConversation.email, message: msgText });
      await loadMessages(selectedConversation);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (error) { console.log("Error sending message:", error); alert("Failed to send message."); } 
    finally { setSending(false); }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const handleCopyChat = () => { navigator.clipboard.writeText(messages.map(m => `${m.sender}: ${m.message}`).join('\n')); alert("Chat copied to clipboard!"); setShowDropdown(false); };
  const handleDeleteChat = async () => { if (window.confirm("Are you sure you want to delete this conversation?")) { try { await API.delete(`/messages/conversation/${selectedConversation._id}`, { data: { myEmail: myEmail } }); setConversations(prev => prev.filter(c => c._id !== selectedConversation._id)); setSelectedConversation(null); setShowDropdown(false); } catch (error) { console.log("Error deleting conversation:", error); } } };
  const handleArchiveChat = () => { setConversations(prev => prev.map(conv => conv._id === selectedConversation._id ? { ...conv, isArchived: !conv.isArchived } : conv)); setSelectedConversation(null); setShowDropdown(false); };

  const formatTime = (timestamp) => { if (!timestamp) return ""; try { return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); } catch (e) { return ""; } };
  const formatDateDivider = (timestamp) => { if (!timestamp) return ''; return new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
  const getStatusIcon = (status) => { switch(status) { case 'sent': return <FaCheck className="message-status-icon sent" />; case 'delivered': return <FaCheckDouble className="message-status-icon delivered" />; case 'read': return <FaCheckDouble className="message-status-icon read" />; default: return <FaClock className="message-status-icon" />; } };
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const viewFiltered = conversations.filter(conv => { if (view === 'inbox') return !conv.isArchived; if (view === 'archived') return conv.isArchived; return true; });
  const searchFiltered = viewFiltered.filter(conv => { const search = searchTerm.toLowerCase(); return (conv.name || "").toLowerCase().includes(search) || (conv.role || "").toLowerCase().includes(search) || (conv.lastMessage || "").toLowerCase().includes(search); });
  const finalFilteredConversations = searchFiltered.filter(conv => { if (filter === "unread") return conv.unreadCount > 0; if (filter === "read") return conv.unreadCount === 0; return true; });
  const filteredCandidates = availableCandidates.filter(c => { const search = candidateSearch.toLowerCase(); return ((c.candidateName || c.name || "") + (c.email || "")).toLowerCase().includes(search); });

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
        
        {/* SIDEBAR (LEFT) */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-top-row">
              <h2><FaEnvelope style={{color:'#e67e22'}} /> Messages</h2>
              <button onClick={handleStartNewConversation} className="btn-new-message"><FaPlus /> New</button>
            </div>
            <div className="sidebar-tabs">
              <span className={view === 'inbox' ? 'active' : ''} onClick={() => { setView('inbox'); setShowNewConversation(false); }}>Inbox</span>
              <span className={view === 'archived' ? 'active' : ''} onClick={() => { setView('archived'); setShowNewConversation(false); }}>Archived</span>
            </div>
            <div className="sidebar-search">
              <FaSearch className="sidebar-search-icon" />
              <input type="text" placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="sidebar-actions">
               <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                  <span className="sidebar-actions-left"><FaFilter style={{color:'#e67e22', fontSize:'12px'}} /> Filters</span>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding:'4px 8px', borderRadius:'4px', border:'1px solid #e2e8f0', outline:'none', fontSize:'12px', cursor:'pointer'}}>
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
               </div>
            </div>
          </div>

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
                <div className="conv-avatar">{conv.profileImage ? <img src={conv.profileImage} alt="avatar" /> : getInitial(conv.name)}</div>
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

        {/* CHAT AREA (RIGHT) */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <FaArrowLeft onClick={() => setSelectedConversation(null)} style={{cursor:'pointer', marginRight:'16px', color:'#64748b', fontSize:'18px'}} />
                  <div className="chat-user-avatar">{selectedConversation.profileImage ? <img src={selectedConversation.profileImage} alt="avatar" /> : getInitial(selectedConversation.name)}</div>
                  <div className="chat-user-text">
                     <span className="chat-user-name">{selectedConversation.name}</span>
                     <span className="chat-user-role">{selectedConversation.role}</span>
                  </div>
                </div>
                <div className="chat-header-actions" style={{position:'relative'}}>
                   <span onClick={() => setShowDropdown(!showDropdown)} ref={dropdownRef}>
                     <FaEllipsisV />
                     {showDropdown && (
                       <div className="action-dropdown" ref={dropdownRef}>
                         <div onClick={handleCopyChat}><FaCopy /> Copy Chat</div>
                         <div onClick={handleArchiveChat} className="archive">{selectedConversation.isArchived ? <FaArchive /> : <FaArchive />} {selectedConversation.isArchived ? ' Unarchive' : ' Archive Chat'}</div>
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
                    
                    const isRealUrl = msg.message && msg.message.startsWith('http');
                    const isImage = isRealUrl && (msg.message.match(/\.(jpeg|jpg|gif|png)$/i) || msg.type === 'image');
                    const isFile = isRealUrl && !isImage;

                    return (
                      <div key={msg._id}>
                        {showDate && <div className="date-divider"><span>{formatDateDivider(msg.timestamp)}</span></div>}
                        <div className={`msg-row ${isRecruiter ? 'sent' : 'received'}`}>
                          <div className="msg-bubble">
                            {!isRecruiter && <span className="msg-sender-name">{selectedConversation.name}</span>}
                            
                            {/* RENDER IMAGE PREVIEW */}
                            {isImage && (
                              <div 
                                style={{ cursor: 'pointer', display: 'inline-block' }} 
                                onClick={() => setViewerFile(msg.message)}
                              >
                                <img 
                                  src={msg.message} 
                                  alt="Attached" 
                                  style={{ maxWidth: '250px', maxHeight: '250px', borderRadius: '8px', marginTop: '4px', display: 'block' }} 
                                />
                              </div>
                            )}
                            
                            {/* RENDER FILE DOWNLOAD LINK */}
                            {isFile && !isImage && (
                              <div 
                                style={{ color: '#e67e22', fontWeight: 600, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} 
                                onClick={() => setViewerFile(msg.message)}
                              >
                                <FaFile /> {msg.originalName || "View Attachment"}
                              </div>
                            )}

                            {/* 🟢 FIXED: Render Normal Text with preserved line breaks */}
                            {!isRealUrl && (
                              <span style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {msg.message}
                              </span>
                            )}
                            
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
                 <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                 
                 {/* 🟢 FIXED: Added position:relative to wrapper */}
                 <div className="chat-input-wrapper" style={{ position: 'relative', display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
                    
                    {/* 🟢 FIXED TEMPLATE BUTTON POSITION */}
                    {!showTemplatePicker && (
                      <span 
                        style={{ cursor: 'pointer', marginRight: '6px', color: '#e67e22', fontSize: '18px' }} 
                        onClick={loadTemplatesForChat}
                        title="Insert a saved template"
                      >
                        <FaFileAlt />
                      </span>
                    )}
                    
                    <FaPaperclip style={{ cursor: 'pointer', color: '#6B7280', fontSize: '18px' }} onClick={handleAttachmentClick} />
                    <input 
                      type="text" 
                      style={{ flex: 1, border: 'none', padding: '8px', outline: 'none', fontSize: '14px', background: 'transparent' }}
                      placeholder="Type your message..." 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      onKeyDown={handleKeyPress} 
                    />
                    <div style={{ position: 'relative' }}>
                      <FaSmile style={{ cursor: 'pointer', color: '#6B7280', fontSize: '18px' }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                      {showEmojiPicker && (
                        <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '40px', right: '0px', zIndex: 100 }}>
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>

                    {/* 🟢 FIXED: TEMPLATE PICKER DROPDOWN - NOW ANCHORED PROPERLY */}
                    {showTemplatePicker && (
                      <div style={{
                        position: 'absolute',
                        bottom: '55px',
                        left: '0',
                        right: '0',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        padding: '12px',
                        maxHeight: '250px',
                        overflowY: 'auto',
                        zIndex: 1000
                      }}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', paddingBottom:'8px', borderBottom:'1px solid #F3F4F6'}}>
                          <span style={{fontWeight:'600', fontSize:'14px', color:'#374151'}}>📄 Select a Template</span>
                          <button 
                            onClick={() => setShowTemplatePicker(false)} 
                            style={{background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', fontSize:'16px'}}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        
                        {templatesList.length > 0 ? templatesList.map(t => (
                          <div 
                            key={t._id} 
                            onClick={() => insertTemplate(t)}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              borderBottom: '1px solid #F9FAFB',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{fontWeight:'600', fontSize:'14px', color:'#111827'}}>{t.name}</div>
                            <div style={{fontSize:'13px', color:'#6B7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                              {t.subject} — {t.body?.substring(0, 60)}...
                            </div>
                          </div>
                        )) : (
                          <div style={{textAlign:'center', color:'#9CA3AF', padding:'20px', fontSize:'14px'}}>
                            No templates found. Go to Templates page to create one.
                          </div>
                        )}
                      </div>
                    )}
                 </div>

                 <button className="btn-send" style={{
                   padding: '8px 20px',
                   background: '#e67e22',
                   color: 'white',
                   border: 'none',
                   borderRadius: '8px',
                   fontWeight: '600',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px'
                 }} onClick={sendMessage} disabled={!newMessage.trim() || sending}>
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

      {/* ========================================== */}
      {/* FILE VIEWER OVERLAY WITH CLOSE BUTTON */}
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

export default Messages;