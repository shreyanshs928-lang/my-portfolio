import React, { useState, useEffect, useContext } from 'react';
import { CursorContext } from '../context/CursorContext';
import { X, Plus, Trash2, Shield, Eye, EyeOff } from 'lucide-react';

export const AdminPanel = ({ isOpen, onClose, portfolioData, onSave, onReset }) => {
  const { triggerDefault } = useContext(CursorContext);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasscode, setShowPasscode] = useState(false);

  // Draft state representing changes in the form
  const [draft, setDraft] = useState(null);

  // New Work item form state
  const [newWork, setNewWork] = useState({
    category: 'social',
    title: '',
    tag: '',
    image: 'svg:social-1',
    desc: '',
    scope: '',
    org: '',
    caseStudyUrl: '',
    videoUrl: '',
    tools: ''
  });

  // New Experience item form state
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    duration: '',
    points: ''
  });

  // Initialize draft when modal opens
  useEffect(() => {
    if (isOpen && portfolioData) {
      setDraft(JSON.parse(JSON.stringify(portfolioData)));
      setIsUnlocked(false);
      setPasscode('');
    }
  }, [isOpen, portfolioData]);

  if (!isOpen || !draft) return null;

  // Validate passcode
  const handleUnlock = () => {
    const validPass = draft.passcode || 'admin';
    if (passcode === validPass) {
      setIsUnlocked(true);
    } else {
      alert('Incorrect passcode.');
      setPasscode('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  // Helper: update direct draft properties
  const updateDraft = (updater) => {
    setDraft((prev) => {
      const next = { ...prev };
      updater(next);
      return next;
    });
  };

  // Add a new work item to the draft
  const handleAddWork = (e) => {
    e.preventDefault();
    if (!newWork.title.trim()) return;

    updateDraft((next) => {
      if (!next.work[newWork.category]) {
        next.work[newWork.category] = [];
      }
      
      const item = {
        title: newWork.title.trim(),
        tag: newWork.tag.trim() || 'Project',
        image: newWork.image.trim()
      };

      if (newWork.category === 'branding') {
        item.desc = newWork.desc.trim();
        item.scope = newWork.scope.trim();
        item.org = newWork.org.trim();
      }

      if (newWork.category === 'ui' && newWork.caseStudyUrl.trim()) {
        item.caseStudyUrl = newWork.caseStudyUrl.trim();
      }

      if (newWork.category === 'video' && newWork.tools.trim()) {
        item.tools = newWork.tools.split(',').map((t) => t.trim()).filter(Boolean);
      }

      next.work[newWork.category].push(item);
    });

    // Reset work form fields
    setNewWork({
      category: newWork.category,
      title: '',
      tag: '',
      image: newWork.category === 'social' ? 'svg:social-1' : newWork.category === 'print' ? 'svg:print-1' : newWork.category === 'ui' ? 'svg:ui-1' : newWork.category === 'reels' ? 'svg:reels-1' : newWork.category === 'video' ? 'svg:video-1' : 'svg:branding-1',
      desc: '',
      scope: '',
      org: '',
      caseStudyUrl: '',
      videoUrl: '',
      tools: ''
    });
  };

  // Delete work item
  const handleDeleteWork = (category, index) => {
    if (window.confirm('Delete this project?')) {
      updateDraft((next) => {
        if (next.work[category]) {
          next.work[category].splice(index, 1);
        }
      });
    }
  };

  // Add a new experience item
  const handleAddExp = (e) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) return;

    updateDraft((next) => {
      const pointsArray = newExp.points
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);

      next.experience.push({
        role: newExp.role.trim(),
        company: newExp.company.trim(),
        duration: newExp.duration.trim() || 'Present',
        points: pointsArray
      });
    });

    setNewExp({ role: '', company: '', duration: '', points: '' });
  };

  // Delete experience item
  const handleDeleteExp = (index) => {
    if (window.confirm('Delete this experience item?')) {
      updateDraft((next) => {
        next.experience.splice(index, 1);
      });
    }
  };

  // Save changes
  const handleSave = () => {
    onSave(draft);
    onClose();
    triggerDefault();
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset all portfolio details back to system defaults?')) {
      onReset();
      onClose();
      triggerDefault();
    }
  };

  return (
    <div className={`admin-overlay ${isOpen ? 'active' : ''}`}>
      {/* 1. Gate Lock Screen */}
      {!isUnlocked ? (
        <div className="admin-gate">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Shield size={32} color="var(--accent)" style={{ marginBottom: '0.8rem' }} />
            <h4 className="admin-gate-title display-font">Admin Access</h4>
          </div>
          <div className="admin-group">
            <label className="admin-label">Passcode</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPasscode ? 'text' : 'password'}
                className="admin-input"
                style={{ paddingRight: '2.5rem' }}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={handleUnlock}>
            Unlock Panel
          </button>
          <button
            className="admin-btn-delete"
            style={{ alignSelf: 'center', fontSize: '0.8rem', marginTop: '1rem', borderBottom: '1px solid transparent' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      ) : (
        /* 2. Admin Workspace Dashboard */
        <div className="admin-panel active">
          <div className="admin-header">
            <h3 className="display-font" style={{ fontSize: '1.2rem', color: 'var(--text-white)' }}>
              CMS Editor
            </h3>
            <button className="admin-btn-delete" onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          <div className="admin-body">
            {/* Sidebar Navigation */}
            <div className="admin-sidebar">
              <button
                className={`admin-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile & Bio
              </button>
              <button
                className={`admin-tab-btn ${activeTab === 'work' ? 'active' : ''}`}
                onClick={() => setActiveTab('work')}
              >
                Work Projects
              </button>
              <button
                className={`admin-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </button>
              <button
                className={`admin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Skills & Tools
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="admin-content">
              {/* TAB: PROFILE & BIO */}
              {activeTab === 'profile' && (
                <div className="admin-tab-content active">
                  <div className="admin-group">
                    <label className="admin-label">Hero Headline</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.profile.tagline}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((n) => {
                          n.profile.tagline = val;
                        });
                      }}
                    />
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">Hero Subhead</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.profile.subhead}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((n) => {
                          n.profile.subhead = val;
                        });
                      }}
                    />
                  </div>

                  <div className="admin-row">
                    <div className="admin-group">
                      <label className="admin-label">Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={draft.profile.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((n) => {
                            n.profile.name = val;
                          });
                        }}
                      />
                    </div>
                    <div className="admin-group">
                      <label className="admin-label">Resume Link</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={draft.profile.resumeUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((n) => {
                            n.profile.resumeUrl = val;
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">About Paragraph (HTML allowed)</label>
                    <textarea
                      className="admin-textarea"
                      style={{ minHeight: '100px' }}
                      value={draft.about.paragraph}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((n) => {
                          n.about.paragraph = val;
                        });
                      }}
                    />
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">About Stat Pills (Comma separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.about.stats.join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        updateDraft((n) => {
                          n.about.stats = arr;
                        });
                      }}
                    />
                  </div>

                  <div className="admin-row">
                    <div className="admin-group">
                      <label className="admin-label">Education Degree</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={draft.background.degree}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((n) => {
                            n.background.degree = val;
                          });
                        }}
                      />
                    </div>
                    <div className="admin-group">
                      <label className="admin-label">Education Year</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={draft.background.year}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((n) => {
                            n.background.year = val;
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">Philosophy Statement</label>
                    <textarea
                      className="admin-textarea"
                      value={draft.background.philosophy}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((n) => {
                          n.background.philosophy = val;
                        });
                      }}
                    />
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">Achievements (One per line)</label>
                    <textarea
                      className="admin-textarea"
                      style={{ minHeight: '80px' }}
                      value={draft.background.achievements.join('\n')}
                      onChange={(e) => {
                        const arr = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                        updateDraft((n) => {
                          n.background.achievements = arr;
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB: WORK PROJECTS */}
              {activeTab === 'work' && (
                <div className="admin-tab-content active">
                  {/* ADD NEW PROJECT FORM */}
                  <form onSubmit={handleAddWork} className="admin-form-section" style={{ marginBottom: '2.5rem' }}>
                    <h4 className="display-font" style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={16} /> Add Work Project
                    </h4>

                    <div className="admin-row">
                      <div className="admin-group">
                        <label className="admin-label">Category</label>
                        <select
                          className="admin-input"
                          value={newWork.category}
                          onChange={(e) => {
                            const cat = e.target.value;
                            let defaultImg = 'svg:social-1';
                            if (cat === 'print') defaultImg = 'svg:print-1';
                            else if (cat === 'ui') defaultImg = 'svg:ui-1';
                            else if (cat === 'reels') defaultImg = 'svg:reels-1';
                            else if (cat === 'video') defaultImg = 'svg:video-1';
                            else if (cat === 'branding') defaultImg = 'svg:branding-1';

                            setNewWork((p) => ({ ...p, category: cat, image: defaultImg }));
                          }}
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <option value="social">Social Media Posts</option>
                          <option value="print">Print & Editorial</option>
                          <option value="ui">UI/UX Design</option>
                          <option value="reels">Short Form Reels</option>
                          <option value="video">Cinematic Video Edits</option>
                          <option value="branding">Branding Identity</option>
                        </select>
                      </div>

                      <div className="admin-group">
                        <label className="admin-label">Image or SVG placeholder key</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newWork.image}
                          onChange={(e) => setNewWork((p) => ({ ...p, image: e.target.value }))}
                          placeholder="e.g. svg:social-1 or image url"
                        />
                      </div>
                    </div>

                    <div className="admin-row">
                      <div className="admin-group">
                        <label className="admin-label">Project Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newWork.title}
                          onChange={(e) => setNewWork((p) => ({ ...p, title: e.target.value }))}
                          placeholder="e.g. MI '25 Launch"
                        />
                      </div>
                      <div className="admin-group">
                        <label className="admin-label">Tag / Platform</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newWork.tag}
                          onChange={(e) => setNewWork((p) => ({ ...p, tag: e.target.value }))}
                          placeholder="e.g. Instagram Post"
                        />
                      </div>
                    </div>

                    {/* Conditional Fields based on work type */}
                    {newWork.category === 'branding' && (
                      <>
                        <div className="admin-row">
                          <div className="admin-group">
                            <label className="admin-label">Brand Scope</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={newWork.scope}
                              onChange={(e) => setNewWork((p) => ({ ...p, scope: e.target.value }))}
                              placeholder="e.g. Logo & Visual Guidelines"
                            />
                          </div>
                          <div className="admin-group">
                            <label className="admin-label">Organization</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={newWork.org}
                              onChange={(e) => setNewWork((p) => ({ ...p, org: e.target.value }))}
                              placeholder="e.g. IIT Bombay"
                            />
                          </div>
                        </div>
                        <div className="admin-group">
                          <label className="admin-label">Brand Description</label>
                          <textarea
                            className="admin-textarea"
                            value={newWork.desc}
                            onChange={(e) => setNewWork((p) => ({ ...p, desc: e.target.value }))}
                            placeholder="Branding systems explanation..."
                          />
                        </div>
                      </>
                    )}

                    {newWork.category === 'ui' && (
                      <div className="admin-group">
                        <label className="admin-label">Case Study Link (Optional)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newWork.caseStudyUrl}
                          onChange={(e) => setNewWork((p) => ({ ...p, caseStudyUrl: e.target.value }))}
                          placeholder="e.g. https://behance.net/..."
                        />
                      </div>
                    )}

                    {newWork.category === 'video' && (
                      <div className="admin-group">
                        <label className="admin-label">Tools Used (Comma separated)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newWork.tools}
                          onChange={(e) => setNewWork((p) => ({ ...p, tools: e.target.value }))}
                          placeholder="e.g. Premiere Pro, After Effects"
                        />
                      </div>
                    )}

                    <button type="submit" className="admin-btn-add">
                      Add Project
                    </button>
                  </form>

                  {/* LIST WORK ITEMS */}
                  <h4 className="display-font" style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    Existing Work Items
                  </h4>
                  {Object.entries(draft.work).map(([category, items]) => (
                    <div key={category} style={{ marginBottom: '2rem' }}>
                      <h5 className="display-font" style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>
                        {category} ({items.length})
                      </h5>
                      <div className="admin-items-list">
                        {items.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem' }}>No projects in this category.</p>
                        ) : (
                          items.map((it, idx) => (
                            <div key={idx} className="admin-item-row">
                              <div className="admin-item-info">
                                <h5>{it.title}</h5>
                                <span>{it.tag}</span>
                              </div>
                              <button
                                type="button"
                                className="admin-btn-delete"
                                onClick={() => handleDeleteWork(category, idx)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: EXPERIENCE TIMELINE */}
              {activeTab === 'experience' && (
                <div className="admin-tab-content active">
                  {/* ADD NEW EXP ITEM */}
                  <form onSubmit={handleAddExp} className="admin-form-section" style={{ marginBottom: '2.5rem' }}>
                    <h4 className="display-font" style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={16} /> Add Experience Item
                    </h4>

                    <div className="admin-row">
                      <div className="admin-group">
                        <label className="admin-label">Role</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newExp.role}
                          onChange={(e) => setNewExp((p) => ({ ...p, role: e.target.value }))}
                          placeholder="e.g. Creative Lead"
                          required
                        />
                      </div>
                      <div className="admin-group">
                        <label className="admin-label">Company / Team</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newExp.company}
                          onChange={(e) => setNewExp((p) => ({ ...p, company: e.target.value }))}
                          placeholder="e.g. Alumination, IIT Bombay"
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-group">
                      <label className="admin-label">Duration</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newExp.duration}
                        onChange={(e) => setNewExp((p) => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g. Jun 2025 – Present"
                      />
                    </div>

                    <div className="admin-group">
                      <label className="admin-label">Bullet points (One per line)</label>
                      <textarea
                        className="admin-textarea"
                        style={{ minHeight: '80px' }}
                        value={newExp.points}
                        onChange={(e) => setNewExp((p) => ({ ...p, points: e.target.value }))}
                        placeholder="Led a group of designers to..."
                      />
                    </div>

                    <button type="submit" className="admin-btn-add">
                      Add Experience
                    </button>
                  </form>

                  {/* LIST EXP ITEMS */}
                  <h4 className="display-font" style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    Manage Experience List
                  </h4>
                  <div className="admin-items-list">
                    {draft.experience.map((exp, idx) => (
                      <div key={idx} className="admin-item-row">
                        <div className="admin-item-info">
                          <h5>{exp.role}</h5>
                          <span>{exp.company} ({exp.duration})</span>
                        </div>
                        <button
                          type="button"
                          className="admin-btn-delete"
                          onClick={() => handleDeleteExp(idx)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SKILLS & TOOLS */}
              {activeTab === 'skills' && (
                <div className="admin-tab-content active">
                  <div className="admin-group">
                    <label className="admin-label">Admin Gateway Passcode Lock</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.passcode || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((n) => {
                          n.passcode = val;
                        });
                      }}
                      placeholder="admin"
                    />
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">Design & Tech Tools (Comma separated)</label>
                    <textarea
                      className="admin-textarea"
                      style={{ minHeight: '80px' }}
                      value={draft.skills.tools.join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        updateDraft((n) => {
                          n.skills.tools = arr;
                        });
                      }}
                    />
                  </div>

                  <div className="admin-group">
                    <label className="admin-label">Disciplines & specialties (Comma separated)</label>
                    <textarea
                      className="admin-textarea"
                      style={{ minHeight: '100px' }}
                      value={draft.skills.other.join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        updateDraft((n) => {
                          n.skills.other = arr;
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer Buttons */}
          <div className="admin-actions" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 2.5rem' }}>
            <button className="admin-btn-delete" onClick={handleReset} style={{ borderBottom: '1px solid transparent' }}>
              Reset to Defaults
            </button>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
                onClick={onClose}
              >
                Discard
              </button>
              <button
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
                onClick={handleSave}
              >
                Save All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
