import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Building,
  MessageSquare,
  BookOpen,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import {
  getStoredFacultyList,
  saveStoredFacultyList,
  CIT_DATASET_METRICS,
} from '../services/mockData';
import './FacultyNetworkPage.css';

export function FacultyNetworkPage({ currentUser, onNavigate, onStartChat }) {
  const [facultyList, setFacultyList] = useState(getStoredFacultyList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding New Teacher to Network
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    dept: 'CSE',
    designation: 'Assistant Professor',
    email: '',
    cabin: '',
    phone: '',
    status: 'Available',
  });

  const [addSuccessMessage, setAddSuccessMessage] = useState('');

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      if (selectedDept !== 'all' && f.dept !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesDept = f.dept.toLowerCase().includes(q);
        const matchesDesig = f.designation.toLowerCase().includes(q);
        if (!matchesName && !matchesDept && !matchesDesig) return false;
      }
      return true;
    });
  }, [facultyList, selectedDept, searchQuery]);

  const handleAddFacultySubmit = (e) => {
    e.preventDefault();
    if (!newFaculty.name.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    const created = {
      id: `fac-${Date.now()}`,
      name: newFaculty.name.trim(),
      dept: newFaculty.dept,
      designation: newFaculty.designation,
      email: newFaculty.email || `${newFaculty.name.toLowerCase().replace(/[^a-z]/g, '')}@cit.edu.in`,
      cabin: newFaculty.cabin || 'A-300',
      phone: newFaculty.phone || '+91 94420 00000',
      status: newFaculty.status,
    };

    const updated = [created, ...facultyList];
    setFacultyList(updated);
    saveStoredFacultyList(updated);

    setAddSuccessMessage(`Prof. ${created.name} successfully joined the CIT Faculty Network!`);
    setTimeout(() => {
      setAddSuccessMessage('');
      setIsAddModalOpen(false);
      setNewFaculty({
        name: '',
        dept: 'CSE',
        designation: 'Assistant Professor',
        email: '',
        cabin: '',
        phone: '',
        status: 'Available',
      });
    }, 1500);
  };

  const handleStartChatWithFaculty = (faculty) => {
    if (onStartChat) {
      onStartChat(faculty.name);
    } else if (onNavigate) {
      onNavigate('faculty-chat');
    }
  };

  const departments = ['all', 'CSE', 'ECE', 'ME', 'IT', 'Math', 'Physics', 'Chemistry', 'Hum'];

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Clean Subpage Header */}
      <div className="subpage-header-card">
        <div>
          <h2 className="section-title" style={{ fontSize: 20 }}>
            Faculty Directory & Collaborative Mesh
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Network of {facultyList.length} educators across CIT engineering, basic science, and humanities departments
          </span>
        </div>

        <button
          type="button"
          className="app-btn-lime add-teacher-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus size={16} />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="subpage-header-card" style={{ marginTop: 20 }}>
        <div className="faculty-search-input-wrap">
          <Search size={18} className="search-icon-muted" />
          <input
            type="text"
            className="faculty-search-input"
            placeholder="Search by faculty name, designation, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dept-filter-tabs">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              className={`dept-pill-btn ${selectedDept === dept ? 'active' : ''}`}
              onClick={() => setSelectedDept(dept)}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Faculty Cards */}
      <div className="faculty-grid">
        {filteredFaculty.map((faculty) => (
          <div key={faculty.id} className="faculty-card animate-card-lift">
            <div className="faculty-card-top">
              <div className="faculty-avatar-circle">
                {faculty.name
                  .replace('Dr. ', '')
                  .replace('Prof. ', '')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="faculty-meta">
                <div className="faculty-name-row">
                  <h3 className="faculty-name-text">
                    {faculty.name}
                    {currentUser?.name === faculty.name && (
                      <span style={{ fontSize: 10, background: 'var(--accent-lime)', color: '#101320', padding: '2px 7px', borderRadius: 9999, marginLeft: 6, fontWeight: 800 }}>
                        YOU
                      </span>
                    )}
                  </h3>
                  <span className={`faculty-status-pill status-${faculty.status.toLowerCase().replace(' ', '-')}`}>
                    {faculty.status}
                  </span>
                </div>
                <div className="faculty-designation-text">
                  {faculty.designation} &bull; <strong style={{ color: '#0f172a', fontWeight: 800 }}>Dept. of {faculty.dept}</strong>
                </div>
              </div>
            </div>

            <div className="faculty-card-details">
              <div className="faculty-detail-row">
                <Building size={14} className="detail-icon" />
                <span>Cabin: <strong>{faculty.cabin}</strong></span>
              </div>
              <div className="faculty-detail-row">
                <Mail size={14} className="detail-icon" />
                <span>{faculty.email}</span>
              </div>
              <div className="faculty-detail-row">
                <Phone size={14} className="detail-icon" />
                <span>{faculty.phone}</span>
              </div>
            </div>

            <div className="faculty-card-actions">
              <button
                type="button"
                className="chat-faculty-btn"
                onClick={() => handleStartChatWithFaculty(faculty)}
              >
                <MessageSquare size={14} />
                <span>Chat with Faculty</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Teacher to CIT Network"
      >
        {addSuccessMessage ? (
          <div className="add-success-box">
            <CheckCircle size={32} color="#10b981" />
            <h3>Teacher Added Successfully!</h3>
            <p>{addSuccessMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleAddFacultySubmit} className="add-faculty-form">
            <div className="form-group">
              <label>Full Name with Title *</label>
              <input
                type="text"
                required
                className="app-input-field"
                placeholder="e.g. Dr. Preeti Sundaram"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Department *</label>
                <select
                  className="app-select-field"
                  value={newFaculty.dept}
                  onChange={(e) => setNewFaculty({ ...newFaculty, dept: e.target.value })}
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="IT">Information Tech (IT)</option>
                  <option value="EE">Electrical (EE)</option>
                  <option value="Math">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Hum">Humanities</option>
                </select>
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <select
                  className="app-select-field"
                  value={newFaculty.designation}
                  onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                >
                  <option value="Professor & Head">Professor & Head</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Adjunct Lecturer">Adjunct Lecturer</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Official Email</label>
                <input
                  type="email"
                  className="app-input-field"
                  placeholder="name@cit.edu.in"
                  value={newFaculty.email}
                  onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Office Cabin / Room</label>
                <input
                  type="text"
                  className="app-input-field"
                  placeholder="e.g. A-214"
                  value={newFaculty.cabin}
                  onChange={(e) => setNewFaculty({ ...newFaculty, cabin: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  className="app-input-field"
                  placeholder="+91 94420 XXXXX"
                  value={newFaculty.phone}
                  onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Current Status</label>
                <select
                  className="app-select-field"
                  value={newFaculty.status}
                  onChange={(e) => setNewFaculty({ ...newFaculty, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="In Class">In Class</option>
                  <option value="Office Hours">Office Hours</option>
                </select>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button
                type="button"
                className="app-btn-outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="app-btn-lime">
                Join Faculty Network
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default FacultyNetworkPage;
