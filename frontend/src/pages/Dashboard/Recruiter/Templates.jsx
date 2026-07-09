import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaCopy,
  FaEye,
  FaSpinner,
  FaEnvelope,
  FaBriefcase,
  FaUserCheck,
  FaCalendarAlt,
  FaRobot,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTag,
  FaFolder,
  FaUsers,
  FaComments,
  FaPaperPlane,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaEllipsisV,
  FaPlusCircle,
  FaFilePdf,
  FaFileWord,
  FaDownload,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaThumbsUp,
  FaList
} from "react-icons/fa";

function Templates() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subject: "",
    body: "",
    tags: [],
    usageCount: 0,
    isDefault: false
  });
  const [tagInput, setTagInput] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await API.get("/templates").catch(() => ({ data: null }));
      
      if (response.data && response.data.length > 0) {
        setTemplates(response.data);
        setApiError(false);
      } else {
        // Mock templates for demo
        setMockTemplates();
        setApiError(true);
      }
    } catch (error) {
      console.log("Error loading templates:", error);
      setMockTemplates();
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const setMockTemplates = () => {
    const mockTemplates = [
      {
        _id: "temp1",
        name: "Job Offer Letter",
        category: "offer",
        subject: "Job Offer - {position} at AIHIRE",
        body: "Dear {candidate_name},\n\nWe are pleased to offer you the position of {position} at AIHIRE. We were impressed by your skills and experience, and we believe you would be a valuable addition to our team.\n\nPlease review the attached offer letter and let us know if you have any questions.\n\nBest regards,\n{recruiter_name}",
        tags: ["offer", "hiring", "formal"],
        usageCount: 45,
        isDefault: true,
        createdAt: "2024-05-10T10:00:00",
        updatedAt: "2024-05-15T14:30:00"
      },
      {
        _id: "temp2",
        name: "Interview Invitation",
        category: "interview",
        subject: "Interview Invitation - {position}",
        body: "Dear {candidate_name},\n\nWe are pleased to invite you for an interview for the {position} position at AIHIRE.\n\nDate: {interview_date}\nTime: {interview_time}\nLocation: {interview_location}\n\nPlease confirm your availability by replying to this email.\n\nBest regards,\n{recruiter_name}",
        tags: ["interview", "scheduling", "formal"],
        usageCount: 38,
        isDefault: true,
        createdAt: "2024-05-12T09:00:00",
        updatedAt: "2024-05-14T11:20:00"
      },
      {
        _id: "temp3",
        name: "Rejection Email",
        category: "rejection",
        subject: "Update on your application - {position}",
        body: "Dear {candidate_name},\n\nThank you for your interest in the {position} position at AIHIRE. We appreciate the time you invested in the application process.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe wish you all the best in your job search.\n\nBest regards,\n{recruiter_name}",
        tags: ["rejection", "formal", "feedback"],
        usageCount: 22,
        isDefault: false,
        createdAt: "2024-05-08T15:00:00",
        updatedAt: "2024-05-13T10:00:00"
      },
      {
        _id: "temp4",
        name: "AI Interview Invitation",
        category: "ai_interview",
        subject: "AI Interview Invitation - {position}",
        body: "Dear {candidate_name},\n\nWe are excited to invite you for an AI-powered interview for the {position} position at AIHIRE.\n\nThis is a video interview that you can complete at your convenience. It will take approximately 30-45 minutes.\n\nPlease click the link below to start your interview:\n{interview_link}\n\nBest regards,\n{recruiter_name}",
        tags: ["ai", "video", "interview"],
        usageCount: 30,
        isDefault: false,
        createdAt: "2024-05-05T08:00:00",
        updatedAt: "2024-05-12T09:30:00"
      },
      {
        _id: "temp5",
        name: "Assessment Invitation",
        category: "assessment",
        subject: "Technical Assessment - {position}",
        body: "Dear {candidate_name},\n\nAs part of the hiring process for the {position} position, we would like you to complete a technical assessment.\n\nThe assessment will test your skills in {skills} and should take approximately 60 minutes.\n\nPlease click the link below to start the assessment:\n{assessment_link}\n\nBest regards,\n{recruiter_name}",
        tags: ["assessment", "technical", "skills"],
        usageCount: 25,
        isDefault: false,
        createdAt: "2024-05-01T11:00:00",
        updatedAt: "2024-05-10T16:45:00"
      },
      {
        _id: "temp6",
        name: "Onboarding Welcome",
        category: "onboarding",
        subject: "Welcome to AIHIRE - {candidate_name}",
        body: "Dear {candidate_name},\n\nWelcome to the AIHIRE team! We are thrilled to have you on board.\n\nYour first day will be {start_date}. Please report to {location} at {time}.\n\nPlease complete the following onboarding tasks before your start date:\n- Complete tax forms\n- Submit identification documents\n- Review employee handbook\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\n{recruiter_name}",
        tags: ["onboarding", "welcome", "new hire"],
        usageCount: 15,
        isDefault: false,
        createdAt: "2024-04-28T09:00:00",
        updatedAt: "2024-05-08T14:00:00"
      },
      {
        _id: "temp7",
        name: "Shortlist Notification",
        category: "shortlist",
        subject: "Shortlisted for {position}",
        body: "Dear {candidate_name},\n\nCongratulations! You have been shortlisted for the {position} position at AIHIRE.\n\nWe were impressed by your application and would like to move you to the next stage of the hiring process.\n\nOur team will be in touch shortly with the next steps.\n\nBest regards,\n{recruiter_name}",
        tags: ["shortlist", "positive", "next steps"],
        usageCount: 20,
        isDefault: false,
        createdAt: "2024-04-20T13:00:00",
        updatedAt: "2024-05-06T10:30:00"
      },
      {
        _id: "temp8",
        name: "Follow-up Email",
        category: "followup",
        subject: "Following up on your application",
        body: "Dear {candidate_name},\n\nI hope this email finds you well.\n\nI'm writing to follow up on your application for the {position} position at AIHIRE. We are still in the process of reviewing applications and will be in touch soon.\n\nThank you for your patience.\n\nBest regards,\n{recruiter_name}",
        tags: ["followup", "pending", "check-in"],
        usageCount: 18,
        isDefault: false,
        createdAt: "2024-04-15T10:00:00",
        updatedAt: "2024-05-04T09:15:00"
      }
    ];
    setTemplates(mockTemplates);

    // Set mock categories
    const mockCategories = [
      { id: "offer", label: "Offer Letters", icon: FaFileAlt, count: 45 },
      { id: "interview", label: "Interview", icon: FaCalendarAlt, count: 38 },
      { id: "rejection", label: "Rejections", icon: FaTimesCircle, count: 22 },
      { id: "ai_interview", label: "AI Interviews", icon: FaRobot, count: 30 },
      { id: "assessment", label: "Assessments", icon: FaStar, count: 25 },
      { id: "onboarding", label: "Onboarding", icon: FaUserCheck, count: 15 },
      { id: "shortlist", label: "Shortlist", icon: FaCheckCircle, count: 20 },
      { id: "followup", label: "Follow-ups", icon: FaClock, count: 18 }
    ];
    setCategories(mockCategories);
  };

  const loadCategories = async () => {
    try {
      const response = await API.get("/templates/categories").catch(() => ({ data: null }));
      
      if (response.data && response.data.length > 0) {
        setCategories(response.data);
      }
      // If API fails, categories will be set from mock data in setMockTemplates
    } catch (error) {
      console.log("Error loading categories:", error);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      const templateData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : tagInput.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      // Try API first, fallback to local
      try {
        await API.post("/templates", templateData);
      } catch {
        // API failed, just add locally
      }
      
      setTemplates(prev => [...prev, { ...templateData, _id: `temp_${Date.now()}`, usageCount: 0, createdAt: new Date().toISOString() }]);
      setIsCreateModalOpen(false);
      resetForm();
      alert("Template created successfully!");
    } catch (error) {
      console.log("Error creating template:", error);
      alert("Failed to create template");
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      const templateData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : tagInput.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      try {
        await API.put(`/templates/${editingTemplate._id}`, templateData);
      } catch {
        // API failed, just update locally
      }
      
      setTemplates(prev => prev.map(t => 
        t._id === editingTemplate._id ? { ...t, ...templateData } : t
      ));
      setIsEditModalOpen(false);
      resetForm();
      alert("Template updated successfully!");
    } catch (error) {
      console.log("Error updating template:", error);
      alert("Failed to update template");
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        try {
          await API.delete(`/templates/${id}`);
        } catch {
          // API failed, just delete locally
        }
        setTemplates(prev => prev.filter(t => t._id !== id));
        alert("Template deleted successfully!");
      } catch (error) {
        console.log("Error deleting template:", error);
        alert("Failed to delete template");
      }
    }
  };

  const handleDuplicateTemplate = async (template) => {
    try {
      const duplicate = {
        ...template,
        name: `${template.name} (Copy)`,
        _id: `temp_${Date.now()}`,
        usageCount: 0,
        createdAt: new Date().toISOString()
      };
      
      try {
        await API.post("/templates", duplicate);
      } catch {
        // API failed, just add locally
      }
      
      setTemplates(prev => [...prev, duplicate]);
      alert("Template duplicated successfully!");
    } catch (error) {
      console.log("Error duplicating template:", error);
      alert("Failed to duplicate template");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      subject: "",
      body: "",
      tags: [],
      usageCount: 0,
      isDefault: false
    });
    setTagInput("");
    setEditingTemplate(null);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body,
      tags: template.tags || [],
      usageCount: template.usageCount,
      isDefault: template.isDefault || false
    });
    setTagInput(template.tags ? template.tags.join(', ') : '');
    setIsEditModalOpen(true);
  };

  const openViewModal = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : FaFileAlt;
  };

  const getCategoryLabel = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "usage") return b.usageCount - a.usageCount;
    if (sortBy === "updated") return new Date(b.updatedAt) - new Date(a.updatedAt);
    return 0;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="templates-loading">
          <FaSpinner className="spin" />
          <p>Loading templates...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="templates-page">
        {/* Header */}
        <div className="templates-header">
          <div className="templates-header-left">
            <h1>
              <FaFileAlt className="templates-header-icon" />
              Templates
            </h1>
            <span className="templates-count">{templates.length} templates</span>
            {apiError && (
              <span className="templates-api-warning">(Using mock data - API not available)</span>
            )}
          </div>
          <div className="templates-header-right">
            <button 
              className="templates-create-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FaPlus /> New Template
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="templates-categories">
          <button
            className={`templates-category-btn ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            <FaFolder />
            All Templates
          </button>
          {categories.map((category) => {
            const Icon = category.icon || FaFileAlt;
            return (
              <button
                key={category.id}
                className={`templates-category-btn ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon />
                {category.label}
                <span className="templates-category-count">{category.count}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="templates-toolbar">
          <div className="templates-search">
            <FaSearch className="templates-search-icon" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="templates-toolbar-right">
            <div className="templates-sort">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="templates-sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="usage">Sort by Usage</option>
                <option value="updated">Sort by Updated</option>
              </select>
            </div>
            <div className="templates-view-toggle">
              <button 
                className={`templates-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <FaThumbsUp />
              </button>
              <button 
                className={`templates-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {viewMode === "grid" ? (
          <div className="templates-grid">
            {sortedTemplates.map((template) => {
              const CategoryIcon = getCategoryIcon(template.category) || FaFileAlt;
              return (
                <div key={template._id} className="templates-card">
                  <div className="templates-card-header">
                    <div className="templates-card-icon">
                      <CategoryIcon />
                    </div>
                    <div className="templates-card-actions">
                      <button 
                        className="templates-card-action"
                        onClick={() => openViewModal(template)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="templates-card-action"
                        onClick={() => handleDuplicateTemplate(template)}
                        title="Duplicate"
                      >
                        <FaCopy />
                      </button>
                      <button 
                        className="templates-card-action"
                        onClick={() => openEditModal(template)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="templates-card-action delete"
                        onClick={() => handleDeleteTemplate(template._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="templates-card-body" onClick={() => openViewModal(template)}>
                    <h3 className="templates-card-name">{template.name}</h3>
                    <p className="templates-card-subject">{template.subject}</p>
                    <p className="templates-card-preview">
                      {template.body.substring(0, 120)}...
                    </p>
                  </div>
                  <div className="templates-card-footer">
                    <div className="templates-card-tags">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="templates-card-tag">{tag}</span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="templates-card-tag more">+{template.tags.length - 3}</span>
                      )}
                    </div>
                    <div className="templates-card-meta">
                      <span className="templates-card-usage">
                        <FaEnvelope /> {template.usageCount}
                      </span>
                      {template.isDefault && (
                        <span className="templates-card-default">Default</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="templates-list-view">
            <table className="templates-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Tags</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTemplates.map((template) => {
                  const CategoryIcon = getCategoryIcon(template.category) || FaFileAlt;
                  return (
                    <tr key={template._id} className="templates-table-row">
                      <td className="templates-table-name">
                        <CategoryIcon className="templates-table-icon" />
                        {template.name}
                        {template.isDefault && (
                          <span className="templates-table-badge">Default</span>
                        )}
                      </td>
                      <td>{getCategoryLabel(template.category)}</td>
                      <td className="templates-table-subject">{template.subject}</td>
                      <td>
                        <div className="templates-table-tags">
                          {template.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="templates-card-tag">{tag}</span>
                          ))}
                          {template.tags.length > 2 && (
                            <span className="templates-card-tag more">+{template.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>{template.usageCount}</td>
                      <td>
                        <div className="templates-table-actions">
                          <button 
                            className="templates-card-action"
                            onClick={() => openViewModal(template)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="templates-card-action"
                            onClick={() => handleDuplicateTemplate(template)}
                            title="Duplicate"
                          >
                            <FaCopy />
                          </button>
                          <button 
                            className="templates-card-action"
                            onClick={() => openEditModal(template)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="templates-card-action delete"
                            onClick={() => handleDeleteTemplate(template._id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {sortedTemplates.length === 0 && (
          <div className="templates-empty">
            <FaFileAlt className="templates-empty-icon" />
            <h3>No templates found</h3>
            <p>
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "Create your first template to get started"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button 
                className="templates-create-btn"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <FaPlus /> Create Template
              </button>
            )}
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedTemplate && (
          <div className="templates-modal-overlay" onClick={() => setIsViewModalOpen(false)}>
            <div className="templates-modal view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="templates-modal-header">
                <h3>Template Preview</h3>
                <button className="templates-modal-close" onClick={() => setIsViewModalOpen(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="templates-modal-body">
                <div className="templates-preview-item">
                  <span className="templates-preview-label">Name</span>
                  <span className="templates-preview-value">{selectedTemplate.name}</span>
                </div>
                <div className="templates-preview-item">
                  <span className="templates-preview-label">Category</span>
                  <span className="templates-preview-value">{getCategoryLabel(selectedTemplate.category)}</span>
                </div>
                <div className="templates-preview-item">
                  <span className="templates-preview-label">Subject</span>
                  <span className="templates-preview-value">{selectedTemplate.subject}</span>
                </div>
                <div className="templates-preview-item">
                  <span className="templates-preview-label">Body</span>
                  <div className="templates-preview-body">
                    {selectedTemplate.body.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="templates-preview-item">
                  <span className="templates-preview-label">Tags</span>
                  <div className="templates-preview-tags">
                    {selectedTemplate.tags.map((tag, index) => (
                      <span key={index} className="templates-card-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="templates-preview-item">
                  <span className="templates-preview-label">Usage</span>
                  <span className="templates-preview-value">{selectedTemplate.usageCount} times</span>
                </div>
              </div>
              <div className="templates-modal-footer">
                <button 
                  className="templates-modal-btn secondary"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
                <button 
                  className="templates-modal-btn primary"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(selectedTemplate);
                  }}
                >
                  <FaEdit /> Edit Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="templates-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
            <div className="templates-modal" onClick={(e) => e.stopPropagation()}>
              <div className="templates-modal-header">
                <h3><FaPlus /> Create New Template</h3>
                <button className="templates-modal-close" onClick={() => setIsCreateModalOpen(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateTemplate}>
                <div className="templates-modal-body">
                  <div className="templates-form-group">
                    <label>Template Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Job Offer Letter"
                      required
                    />
                  </div>
                  <div className="templates-form-group">
                    <label>Category <span className="required">*</span></label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="templates-form-group">
                    <label>Subject <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="e.g., Job Offer - {position} at AIHIRE"
                      required
                    />
                    <span className="templates-form-hint">Use {'{variable}'} for dynamic content</span>
                  </div>
                  <div className="templates-form-group">
                    <label>Body <span className="required">*</span></label>
                    <textarea
                      rows="8"
                      value={formData.body}
                      onChange={(e) => setFormData({...formData, body: e.target.value})}
                      placeholder="Dear {candidate_name},&#10;&#10;We are pleased to offer you..."
                      required
                    />
                    <span className="templates-form-hint">Available variables: {'{candidate_name}'}, {'{position}'}, {'{recruiter_name}'}, {'{interview_date}'}, {'{interview_time}'}, etc.</span>
                  </div>
                  <div className="templates-form-group">
                    <label>Tags</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="offer, hiring, formal (comma separated)"
                    />
                  </div>
                  <div className="templates-form-group">
                    <label className="templates-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      />
                      Set as default template
                    </label>
                  </div>
                </div>
                <div className="templates-modal-footer">
                  <button 
                    type="button" 
                    className="templates-modal-btn secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="templates-modal-btn primary">
                    <FaSave /> Create Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingTemplate && (
          <div className="templates-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
            <div className="templates-modal" onClick={(e) => e.stopPropagation()}>
              <div className="templates-modal-header">
                <h3><FaEdit /> Edit Template</h3>
                <button className="templates-modal-close" onClick={() => setIsEditModalOpen(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleUpdateTemplate}>
                <div className="templates-modal-body">
                  <div className="templates-form-group">
                    <label>Template Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="templates-form-group">
                    <label>Category <span className="required">*</span></label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="templates-form-group">
                    <label>Subject <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="templates-form-group">
                    <label>Body <span className="required">*</span></label>
                    <textarea
                      rows="8"
                      value={formData.body}
                      onChange={(e) => setFormData({...formData, body: e.target.value})}
                      required
                    />
                  </div>
                  <div className="templates-form-group">
                    <label>Tags</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="offer, hiring, formal (comma separated)"
                    />
                  </div>
                  <div className="templates-form-group">
                    <label className="templates-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      />
                      Set as default template
                    </label>
                  </div>
                </div>
                <div className="templates-modal-footer">
                  <button 
                    type="button" 
                    className="templates-modal-btn secondary"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="templates-modal-btn primary">
                    <FaSave /> Update Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Templates;