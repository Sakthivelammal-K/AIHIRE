import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCopy,
  FaEye,
  FaSpinner,
  FaEnvelope,
  FaBriefcase,
  FaTimes,
  FaSave,
  FaList,
  FaThumbsUp,
  FaFolder,
  FaUsers,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock
} from "react-icons/fa";

function Templates() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  // 🟢 Tab State for All, Email, and Job
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subject: "",
    body: "",
    tags: [],
    usageCount: 0,
    isDefault: false,
    
    // 🟢 Job Specific Fields (ALL)
    jobTitle: "",
    description: "",
    requirements: [],
    responsibilities: [],
    salaryRange: "",
    location: "",
    employmentType: "Full-time",
    
    // 🟢 NEW FIELDS ADDED
    summary: "",
    department: "",
    workMode: "Hybrid",
    experienceLevel: "Mid Level (2-5 years)",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    applicationDeadline: "",
    openings: "",
    benefits: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [apiError, setApiError] = useState(false);

  const myEmail = localStorage.getItem("email");

  useEffect(() => {
    loadTemplates();
  }, [activeTab]);

  // ✅ Unified backend with 'type' parameter (Handles 'all')
  const loadTemplates = async () => {
    setLoading(true);
    try {
      let url = `/templates?recruiter_email=${myEmail}`;
      if (activeTab !== "all") {
        url += `&type=${activeTab}`;
      }
      
      const response = await API.get(url);
      
      if (response.data && response.data.length > 0) {
        setTemplates(response.data);
        setApiError(false);
      } else {
        setTemplates([]);
        setApiError(true);
      }
    } catch (error) {
      console.log("Error loading templates:", error);
      setTemplates([]);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      let finalTags = formData.tags;
      if (!finalTags || finalTags.length === 0) {
        finalTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      }

      const templateData = {
        ...formData,
        tags: finalTags,
        createdBy: myEmail,
        type: activeTab === "email" ? "email" : (activeTab === "job" ? "job" : "email")
      };

      await API.post("/templates", templateData);
      
      setIsCreateModalOpen(false);
      resetForm();
      loadTemplates();
      alert("Template created successfully!");
    } catch (error) {
      console.log("Error creating template:", error);
      alert("Failed to create template");
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      let finalTags = formData.tags;
      if (!finalTags || finalTags.length === 0) {
        finalTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      }

      const templateData = {
        ...formData,
        tags: finalTags
      };
      
      await API.put(`/templates/${editingTemplate._id}`, templateData);
      
      setIsEditModalOpen(false);
      resetForm();
      loadTemplates();
      alert("Template updated successfully!");
    } catch (error) {
      console.log("Error updating template:", error);
      alert("Failed to update template");
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await API.delete(`/templates/${id}`);
        loadTemplates();
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
        _id: undefined,
        usageCount: 0
      };
      
      await API.post(`/templates`, duplicate);
      loadTemplates();
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
      isDefault: false,
      jobTitle: "",
      description: "",
      requirements: [],
      responsibilities: [],
      salaryRange: "",
      location: "",
      employmentType: "Full-time",
      summary: "",
      department: "",
      workMode: "Hybrid",
      experienceLevel: "Mid Level (2-5 years)",
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      applicationDeadline: "",
      openings: "",
      benefits: ""
    });
    setTagInput("");
    setEditingTemplate(null);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject || "",
      body: template.body || "",
      tags: template.tags || [],
      usageCount: template.usageCount,
      isDefault: template.isDefault || false,
      jobTitle: template.jobTitle || "",
      description: template.description || "",
      requirements: template.requirements || [],
      responsibilities: template.responsibilities || [],
      salaryRange: template.salaryRange || "",
      location: template.location || "",
      employmentType: template.employmentType || "Full-time",
      summary: template.summary || "",
      department: template.department || "",
      workMode: template.workMode || "Hybrid",
      experienceLevel: template.experienceLevel || "Mid Level (2-5 years)",
      minExperience: template.minExperience || "",
      maxExperience: template.maxExperience || "",
      minSalary: template.minSalary || "",
      maxSalary: template.maxSalary || "",
      applicationDeadline: template.applicationDeadline || "",
      openings: template.openings || "",
      benefits: template.benefits || ""
    });
    setTagInput(template.tags ? template.tags.join(', ') : '');
    setIsEditModalOpen(true);
  };

  const openViewModal = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (template.subject || template.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (template.body || template.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (template.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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
            {apiError && <span className="templates-api-warning">(API not available)</span>}
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

        {/* 🟢 MAIN TAB SWITCHER (Styled Gray Container) */}
        <div 
          className="templates-switcher-container" 
          style={{
            background: '#f8fafc',
            padding: '6px',
            borderRadius: '12px',
            display: 'flex',
            gap: '6px',
            marginBottom: '20px',
            width: 'fit-content'
          }}
        >
          <button 
            className={`templates-tab ${activeTab === "all" ? "active" : ""}`}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'all' ? '#fff' : 'transparent',
              color: activeTab === 'all' ? '#F97316' : '#6B7280',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: '0.3s'
            }}
            onClick={() => { setActiveTab("all"); setSelectedCategory("all"); setSearchTerm(""); }}
          >
            <FaFolder /> All Templates
          </button>
          <button 
            className={`templates-tab ${activeTab === "email" ? "active" : ""}`}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'email' ? '#fff' : 'transparent',
              color: activeTab === 'email' ? '#F97316' : '#6B7280',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'email' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: '0.3s'
            }}
            onClick={() => { setActiveTab("email"); setSelectedCategory("all"); setSearchTerm(""); }}
          >
            <FaEnvelope /> Email Templates
          </button>
          <button 
            className={`templates-tab ${activeTab === "job" ? "active" : ""}`}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'job' ? '#fff' : 'transparent',
              color: activeTab === 'job' ? '#F97316' : '#6B7280',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'job' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: '0.3s'
            }}
            onClick={() => { setActiveTab("job"); setSelectedCategory("all"); setSearchTerm(""); }}
          >
            <FaBriefcase /> Job Description Templates
          </button>
        </div>

        {/* 🟢 CATEGORIES (Only visible for Jobs) */}
       {/*} {activeTab === "job" && (
          <div 
            className="templates-categories"
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}
          >
            <button
              className={`templates-category-btn ${selectedCategory === "all" ? "active" : ""}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid transparent',
                borderRadius: '8px',
                background: selectedCategory === 'all' ? '#FFF7ED' : '#F9FAFB',
                color: selectedCategory === 'all' ? '#F97316' : '#6B7280',
                fontWeight: '500',
                cursor: 'pointer',
                borderColor: selectedCategory === 'all' ? '#FED7AA' : 'transparent'
              }}
              onClick={() => setSelectedCategory("all")}
            >
              <FaFolder /> All Templates
            </button>
            <button 
              className="templates-category-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid transparent',
                borderRadius: '8px',
                background: '#F9FAFB',
                color: '#6B7280',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedCategory("engineering")}
            >
              <FaBriefcase /> Engineering
            </button>
            <button 
              className="templates-category-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid transparent',
                borderRadius: '8px',
                background: '#F9FAFB',
                color: '#6B7280',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedCategory("sales")}
            >
              <FaUsers /> Sales
            </button>
            <button 
              className="templates-category-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid transparent',
                borderRadius: '8px',
                background: '#F9FAFB',
                color: '#6B7280',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedCategory("design")}
            >
              <FaFileAlt /> Design
            </button>
          </div>
        )}*/}

        {/* Toolbar */}
        <div 
          className="templates-toolbar"
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}
        >
          <div 
            className="templates-search"
            style={{
              flex: 1,
              position: 'relative',
              minWidth: '200px'
            }}
          >
            <FaSearch 
              className="templates-search-icon" 
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }}
            />
            <input
              type="text"
              placeholder={`Search ${activeTab === "all" ? "all" : activeTab} templates...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 44px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div 
            className="templates-toolbar-right"
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <div className="templates-sort">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fff',
                  outline: 'none'
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="usage">Sort by Usage</option>
                <option value="updated">Sort by Updated</option>
              </select>
            </div>
            <div 
              className="templates-view-toggle"
              style={{
                display: 'flex',
                gap: '4px',
                background: '#F3F4F6',
                padding: '4px',
                borderRadius: '8px'
              }}
            >
              <button 
                className={`templates-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'grid' ? '#fff' : 'transparent',
                  color: viewMode === 'grid' ? '#F97316' : '#6B7280',
                  cursor: 'pointer'
                }}
              >
                <FaThumbsUp />
              </button>
              <button 
                className={`templates-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'list' ? '#fff' : 'transparent',
                  color: viewMode === 'list' ? '#F97316' : '#6B7280',
                  cursor: 'pointer'
                }}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {viewMode === "grid" ? (
          <div 
            className="templates-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {sortedTemplates.map((template) => {
              const safeSubject = template.subject || "";
              const safeBody = template.body || "";
              const safeJobTitle = template.jobTitle || "";
              const safeDescription = template.description || "";
              const safeLocation = template.location || "";

              return (
                <div 
                  key={template._id} 
                  className="templates-card"
                  style={{
                    background: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: '0.3s'
                  }}
                >
                  <div 
                    className="templates-card-header"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}
                  >
                    <div 
                      className="templates-card-icon"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#FFF7ED',
                        color: '#F97316',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}
                    >
                      {activeTab === "email" || activeTab === "all" ? <FaEnvelope /> : <FaBriefcase />}
                    </div>
                    <div 
                      className="templates-card-actions"
                      style={{
                        display: 'flex',
                        gap: '4px'
                      }}
                    >
                      <button className="templates-card-action" onClick={() => openViewModal(template)}><FaEye /></button>
                      <button className="templates-card-action" onClick={() => handleDuplicateTemplate(template)}><FaCopy /></button>
                      <button className="templates-card-action" onClick={() => openEditModal(template)}><FaEdit /></button>
                      <button className="templates-card-action delete" onClick={() => handleDeleteTemplate(template._id)}><FaTrash /></button>
                    </div>
                  </div>
                  <div className="templates-card-body" onClick={() => openViewModal(template)}>
                    <h3 className="templates-card-name">{template.name}</h3>
                    {activeTab === "email" || (activeTab === "all" && template.type === "email") ? (
                      <>
                        <p className="templates-card-subject">{safeSubject}</p>
                        <p className="templates-card-preview">{safeBody.substring(0, 120)}...</p>
                      </>
                    ) : (
                      <>
                        <p className="templates-card-subject"><FaBriefcase /> {safeJobTitle}</p>
                        <p className="templates-card-preview">{safeDescription.substring(0, 120)}...</p>
                        {safeLocation && <p className="templates-card-location"><FaMapMarkerAlt /> {safeLocation}</p>}
                      </>
                    )}
                  </div>
                  <div 
                    className="templates-card-footer"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #F3F4F6'
                    }}
                  >
                    <div 
                      className="templates-card-tags"
                      style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap'
                      }}
                    >
                      {(template.tags || []).slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="templates-card-tag"
                          style={{
                            padding: '2px 10px',
                            background: '#F3F4F6',
                            borderRadius: '20px',
                            fontSize: '11px',
                            color: '#6B7280'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div 
                      className="templates-card-meta"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span className="templates-card-usage"><FaEnvelope /> {template.usageCount}</span>
                      {template.isDefault && <span className="templates-card-default">Default</span>}
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
                  <th>{activeTab === "email" ? "Subject" : "Job Title"}</th>
                  <th>Category</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTemplates.map((template) => {
                  const safeSubject = template.subject || "";
                  const safeJobTitle = template.jobTitle || "";

                  return (
                    <tr key={template._id} className="templates-table-row">
                      <td className="templates-table-name">
                        {activeTab === "email" || (activeTab === "all" && template.type === "email") ? <FaEnvelope className="templates-table-icon" /> : <FaBriefcase className="templates-table-icon" />}
                        {template.name}
                        {template.isDefault && <span className="templates-table-badge">Default</span>}
                      </td>
                      <td>{activeTab === "email" || (activeTab === "all" && template.type === "email") ? safeSubject : safeJobTitle}</td>
                      <td>{template.category}</td>
                      <td>{template.usageCount}</td>
                      <td>
                        <div className="templates-table-actions">
                          <button className="templates-card-action" onClick={() => openViewModal(template)}><FaEye /></button>
                          <button className="templates-card-action" onClick={() => handleDuplicateTemplate(template)}><FaCopy /></button>
                          <button className="templates-card-action" onClick={() => openEditModal(template)}><FaEdit /></button>
                          <button className="templates-card-action delete" onClick={() => handleDeleteTemplate(template._id)}><FaTrash /></button>
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
            <p>Create your first template to get started</p>
            <button className="templates-create-btn" onClick={() => setIsCreateModalOpen(true)}>
              <FaPlus /> Create Template
            </button>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedTemplate && (
          <div className="templates-modal-overlay" onClick={() => setIsViewModalOpen(false)}>
            <div className="templates-modal view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="templates-modal-header">
                <h3>Template Preview</h3>
                <button className="templates-modal-close" onClick={() => setIsViewModalOpen(false)}><FaTimes /></button>
              </div>
              <div className="templates-modal-body">
                <div className="templates-preview-item"><span className="templates-preview-label">Name</span><span className="templates-preview-value">{selectedTemplate.name}</span></div>
                <div className="templates-preview-item"><span className="templates-preview-label">Category</span><span className="templates-preview-value">{selectedTemplate.category}</span></div>
                
                {selectedTemplate.type === "email" ? (
                  <>
                    <div className="templates-preview-item"><span className="templates-preview-label">Subject</span><span className="templates-preview-value">{selectedTemplate.subject}</span></div>
                    <div className="templates-preview-item"><span className="templates-preview-label">Body</span><div className="templates-preview-body">{selectedTemplate.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div></div>
                  </>
                ) : (
                  <>
                    <div className="templates-preview-item"><span className="templates-preview-label">Job Title</span><span className="templates-preview-value">{selectedTemplate.jobTitle}</span></div>
                    <div className="templates-preview-item"><span className="templates-preview-label">Location</span><span className="templates-preview-value">{selectedTemplate.location}</span></div>
                    <div className="templates-preview-item"><span className="templates-preview-label">Employment Type</span><span className="templates-preview-value">{selectedTemplate.employmentType}</span></div>
                    <div className="templates-preview-item"><span className="templates-preview-label">Description</span><div className="templates-preview-body">{selectedTemplate.description.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div></div>
                    <div className="templates-preview-item"><span className="templates-preview-label">Requirements</span><ul>{selectedTemplate.requirements.map((req, i) => <li key={i}>{req}</li>)}</ul></div>
                  </>
                )}
              </div>
              <div className="templates-modal-footer">
                <button className="templates-modal-btn secondary" onClick={() => setIsViewModalOpen(false)}>Close</button>
                <button className="templates-modal-btn primary" onClick={() => { setIsViewModalOpen(false); openEditModal(selectedTemplate); }}><FaEdit /> Edit</button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="templates-modal-overlay" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>
            <div className="templates-modal" onClick={(e) => e.stopPropagation()}>
              <div className="templates-modal-header">
                <h3>{isEditModalOpen ? <FaEdit /> : <FaPlus />} {isEditModalOpen ? "Edit" : "Create New"} Template</h3>
                <button className="templates-modal-close" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}><FaTimes /></button>
              </div>
              <form onSubmit={isEditModalOpen ? handleUpdateTemplate : handleCreateTemplate}>
                <div className="templates-modal-body">
                  <div className="templates-form-group">
                    <label>Template Name <span className="required">*</span></label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  
                  <div className="templates-form-group">
                    <label>Category <span className="required">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="Type a category (e.g. Engineering, Sales, Healthcare, Finance)"
                        required
                        list="job-category-suggestions"
                      />
                      <datalist id="job-category-suggestions">
                        <option value="Engineering" />
                        <option value="Sales" />
                        <option value="Marketing" />
                        <option value="Design" />
                        <option value="Finance" />
                        <option value="Accounting" />
                        <option value="Legal" />
                        <option value="HR / People Operations" />
                        <option value="Healthcare" />
                        <option value="Education" />
                        <option value="Operations" />
                        <option value="IT / Support" />
                        <option value="Management" />
                        <option value="Retail" />
                        <option value="Hospitality" />
                        <option value="Manufacturing" />
                        <option value="Logistics" />
                      </datalist>
                    </div>
                    {formData.category && (
                      <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{
                          display: 'inline-block',
                          background: '#fdf2e9',
                          color: '#e67e22',
                          padding: '2px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {formData.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {activeTab === "email" ? (
                    <>
                      <div className="templates-form-group">
                        <label>Subject <span className="required">*</span></label>
                        <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
                      </div>
                      <div className="templates-form-group">
                        <label>Body <span className="required">*</span></label>
                        <textarea rows="8" value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} required />
                      </div>
                    </>
                  ) : (
                    // 🟢 FULL JOB TEMPLATE FORM (WITH DYNAMIC INPUTS)
                    <>
                      <div className="templates-form-group">
                        <label>Job Title <span className="required">*</span></label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                            placeholder="e.g. Senior Software Engineer, Product Manager"
                            required
                            list="job-title-suggestions"
                          />
                          <datalist id="job-title-suggestions">
                            <option value="Senior Software Engineer" />
                            <option value="Product Manager" />
                            <option value="UX/UI Designer" />
                            <option value="Data Scientist" />
                            <option value="DevOps Engineer" />
                            <option value="Marketing Manager" />
                            <option value="Sales Representative" />
                            <option value="HR Generalist" />
                            <option value="Customer Support Specialist" />
                            <option value="Project Manager" />
                          </datalist>
                        </div>
                      </div>
                      
                      <div className="templates-form-group">
                        <label>Department</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            placeholder="e.g. Engineering, Marketing, HR, Operations"
                            list="department-suggestions"
                          />
                          <datalist id="department-suggestions">
                            <option value="Engineering" />
                            <option value="Product" />
                            <option value="Design" />
                            <option value="Sales" />
                            <option value="Marketing" />
                            <option value="Human Resources" />
                            <option value="Operations" />
                            <option value="Finance" />
                            <option value="Legal" />
                            <option value="Customer Success" />
                            <option value="IT / Support" />
                          </datalist>
                        </div>
                      </div>

                      <div className="templates-form-group">
                        <label>Location</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g. New York, London, Remote, Austin"
                            list="location-suggestions"
                          />
                          <datalist id="location-suggestions">
                            <option value="Remote" />
                            <option value="Hybrid" />
                            <option value="New York, NY" />
                            <option value="San Francisco, CA" />
                            <option value="Austin, TX" />
                            <option value="Los Angeles, CA" />
                            <option value="London, UK" />
                            <option value="Toronto, Canada" />
                            <option value="Sydney, Australia" />
                            <option value="Berlin, Germany" />
                          </datalist>
                        </div>
                      </div>

                      <div className="templates-form-group">
                        <label>Work Mode</label>
                        <select value={formData.workMode} onChange={(e) => setFormData({...formData, workMode: e.target.value})}>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                          <option value="On-site">On-site</option>
                        </select>
                      </div>

                      <div className="templates-form-group">
                        <label>Employment Type</label>
                        <select value={formData.employmentType} onChange={(e) => setFormData({...formData, employmentType: e.target.value})}>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div className="templates-form-group">
                        <label>Experience Level</label>
                        <select value={formData.experienceLevel} onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}>
                          <option value="Entry Level">Entry Level</option>
                          <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                          <option value="Senior Level">Senior Level</option>
                          <option value="Lead">Lead</option>
                          <option value="Manager">Manager</option>
                        </select>
                      </div>

                      <div className="templates-form-group">
                        <label>Job Summary <span className="required">*</span></label>
                        <textarea rows="3" value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} required />
                      </div>

                      <div className="templates-form-group">
                        <label>Job Description <span className="required">*</span></label>
                        <textarea rows="6" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                      </div>

                      <div className="templates-form-group">
                        <label>Requirements (comma separated)</label>
                        <input type="text" value={formData.requirements.join(', ')} onChange={(e) => setFormData({...formData, requirements: e.target.value.split(',').map(r => r.trim()).filter(Boolean)})} />
                      </div>

                      <div className="templates-form-group">
                        <label>Years of Experience</label>
                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                          <input type="number" placeholder="Min" value={formData.minExperience} onChange={(e) => setFormData({...formData, minExperience: e.target.value})} />
                          <span>to</span>
                          <input type="number" placeholder="Max" value={formData.maxExperience} onChange={(e) => setFormData({...formData, maxExperience: e.target.value})} />
                        </div>
                      </div>

                      <div className="templates-form-group">
                        <label>Salary Range</label>
                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                          <input type="number" placeholder="Min" value={formData.minSalary} onChange={(e) => setFormData({...formData, minSalary: e.target.value})} />
                          <span>to</span>
                          <input type="number" placeholder="Max" value={formData.maxSalary} onChange={(e) => setFormData({...formData, maxSalary: e.target.value})} />
                        </div>
                      </div>

                      <div className="templates-form-group">
                        <label>Application Deadline</label>
                        <input type="date" value={formData.applicationDeadline} onChange={(e) => setFormData({...formData, applicationDeadline: e.target.value})} />
                      </div>

                      <div className="templates-form-group">
                        <label>Number of Openings</label>
                        <input type="number" value={formData.openings} onChange={(e) => setFormData({...formData, openings: e.target.value})} />
                      </div>

                      <div className="templates-form-group">
                        <label>Benefits</label>
                        <input type="text" value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} />
                      </div>
                    </>
                  )}

                  <div className="templates-form-group">
                    <label>Tags (comma separated)</label>
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
                  </div>
                </div>
                <div className="templates-modal-footer">
                  <button type="button" className="templates-modal-btn secondary" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>Cancel</button>
                  <button type="submit" className="templates-modal-btn primary"><FaSave /> {isEditModalOpen ? "Update" : "Create"}</button>
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