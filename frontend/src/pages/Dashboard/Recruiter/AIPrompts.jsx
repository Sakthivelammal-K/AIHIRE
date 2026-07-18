import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaRobot,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaSave,
  FaBrain,
  FaList
} from "react-icons/fa";

function AIPrompts() {
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    userPrompt: "",
    temperature: 0.7,
    category: "general"
  });
  const [apiError, setApiError] = useState(false);

  const myEmail = localStorage.getItem("email");

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/ai-prompts?recruiter_email=${myEmail}`);
      if (response.data && response.data.length > 0) {
        setPrompts(response.data);
        setApiError(false);
      } else {
        setPrompts([]);
        setApiError(true);
      }
    } catch (error) {
      console.log("Error loading AI prompts:", error);
      setPrompts([]);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    try {
      await API.post("/ai-prompts", { ...formData, createdBy: myEmail });
      setShowModal(false);
      resetForm();
      loadPrompts();
      alert("AI Prompt template created successfully!");
    } catch (error) {
      console.log("Error creating AI prompt:", error);
      alert("Failed to create AI prompt.");
    }
  };

  const handleUpdatePrompt = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/ai-prompts/${editingId}`, formData);
      setShowModal(false);
      resetForm();
      loadPrompts();
      alert("AI Prompt template updated successfully!");
    } catch (error) {
      console.log("Error updating AI prompt:", error);
      alert("Failed to update AI prompt.");
    }
  };

  const handleDeletePrompt = async (id) => {
    if (window.confirm("Are you sure you want to delete this AI prompt template?")) {
      try {
        await API.delete(`/ai-prompts/${id}`);
        loadPrompts();
        alert("AI Prompt template deleted successfully!");
      } catch (error) {
        console.log("Error deleting AI prompt:", error);
        alert("Failed to delete AI prompt.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      systemPrompt: "",
      userPrompt: "",
      temperature: 0.7,
      category: "general"
    });
    setEditingId(null);
  };

  const openEditModal = (prompt) => {
    setEditingId(prompt._id);
    setFormData({
      name: prompt.name,
      description: prompt.description || "",
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      temperature: prompt.temperature || 0.7,
      category: prompt.category || "general"
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="templates-loading">
          <FaSpinner className="spin" />
          <p>Loading AI prompts...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="templates-page">
        <div className="templates-header">
          <div className="templates-header-left">
            <h1><FaRobot className="templates-header-icon" /> AI Prompt Templates</h1>
            <span className="templates-count">{prompts.length} prompts</span>
          </div>
          <div className="templates-header-right">
            <button className="templates-create-btn" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus /> New AI Prompt
            </button>
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className="templates-empty">
            <FaBrain className="templates-empty-icon" />
            <h3>No AI prompts found</h3>
            <p>Create your first AI prompt template to get started</p>
            <button className="templates-create-btn" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus /> Create AI Prompt
            </button>
          </div>
        ) : (
          <div className="templates-grid">
            {prompts.map((prompt) => (
              <div key={prompt._id} className="templates-card">
                <div className="templates-card-header">
                  <div className="templates-card-icon"><FaBrain /></div>
                  <div className="templates-card-actions">
                    <button className="templates-card-action" onClick={() => openEditModal(prompt)}><FaEdit /></button>
                    <button className="templates-card-action delete" onClick={() => handleDeletePrompt(prompt._id)}><FaTrash /></button>
                  </div>
                </div>
                <div className="templates-card-body">
                  <h3 className="templates-card-name">{prompt.name}</h3>
                  <p className="templates-card-subject">{prompt.description || prompt.category}</p>
                  <p className="templates-card-preview">System: {prompt.systemPrompt?.substring(0, 50)}...</p>
                </div>
                <div className="templates-card-footer">
                  <div className="templates-card-meta">
                    <span className="templates-card-tag">Temp: {prompt.temperature || 0.7}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="templates-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="templates-modal" onClick={(e) => e.stopPropagation()}>
            <div className="templates-modal-header">
              <h3>{editingId ? <FaEdit /> : <FaPlus />} {editingId ? "Edit" : "Create"} AI Prompt</h3>
              <button className="templates-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={editingId ? handleUpdatePrompt : handleCreatePrompt}>
              <div className="templates-modal-body">
                <div className="templates-form-group">
                  <label>Prompt Name <span className="required">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                <div className="templates-form-group">
                  <label>Description</label>
                  <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="e.g. Rejection email generator" />
                </div>

                <div className="templates-form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="general">General</option>
                    <option value="email">Email Writing</option>
                    <option value="interview">Interview Generation</option>
                    <option value="summary">Resume Summary</option>
                    <option value="rejection">Rejection</option>
                  </select>
                </div>

                <div className="templates-form-group">
                  <label>System Prompt <span className="required">*</span></label>
                  <textarea 
                    rows="4" 
                    value={formData.systemPrompt} 
                    onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})} 
                    placeholder="e.g. You are a professional HR recruiter. Be polite and concise."
                    required
                  />
                </div>

                <div className="templates-form-group">
                  <label>User Prompt <span className="required">*</span></label>
                  <textarea 
                    rows="4" 
                    value={formData.userPrompt} 
                    onChange={(e) => setFormData({...formData, userPrompt: e.target.value})} 
                    placeholder="e.g. Write a rejection email to {candidate_name} for the position {job_title}."
                    required
                  />
                  <span className="templates-form-hint">Use {'{placeholder}'} for dynamic content.</span>
                </div>

                <div className="templates-form-group">
                  <label>Temperature (Creativity)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={formData.temperature} 
                    onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                    <span>Precise</span>
                    <span>{formData.temperature}</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>
              <div className="templates-modal-footer">
                <button type="button" className="templates-modal-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="templates-modal-btn primary"><FaSave /> {editingId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AIPrompts;