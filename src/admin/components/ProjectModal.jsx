import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import { X, Plus, Trash2 } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose, project, category, onSave }) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [scope, setScope] = useState('');
  const [org, setOrg] = useState('');
  const [link, setLink] = useState('');
  const [caseStudyUrl, setCaseStudyUrl] = useState('');
  const [status, setStatus] = useState('published');
  
  // Storing list of tools
  const [tools, setTools] = useState([]);
  const [toolInput, setToolInput] = useState('');

  // Update form state when project changes (for editing)
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setTag(project.tag || '');
      setImage(project.image || '');
      setDesc(project.desc || '');
      setScope(project.scope || '');
      setOrg(project.org || '');
      setLink(project.link || '');
      setCaseStudyUrl(project.caseStudyUrl || '');
      setTools(project.tools || []);
      setStatus(project.status || 'published');
    } else {
      // Clear forms for new entries
      setTitle('');
      setTag('');
      setImage(category === 'social' ? 'svg:social-1' : category === 'print' ? 'svg:print-1' : category === 'ui' ? 'svg:ui-1' : category === 'reels' ? 'svg:reels-1' : category === 'video' ? 'svg:video-1' : 'svg:branding-1');
      setDesc('');
      setScope('');
      setOrg('');
      setLink('');
      setCaseStudyUrl('');
      setTools([]);
      setStatus('published');
    }
  }, [project, category, isOpen]);

  if (!isOpen) return null;

  const handleAddTool = (e) => {
    e.preventDefault();
    const clean = toolInput.trim();
    if (clean && !tools.includes(clean)) {
      setTools([...tools, clean]);
    }
    setToolInput('');
  };

  const handleRemoveTool = (toolToRemove) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Project Title is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      tag: tag.trim() || 'Project',
      image,
      status,
      link: link.trim()
    };

    if (project?.id) {
      payload.id = project.id;
      payload.orderIndex = project.orderIndex;
    } else {
      payload.id = 'proj-' + category + '-' + Date.now();
      payload.orderIndex = 999; // Added to end
    }

    // Add conditional details based on category
    if (category === 'branding') {
      payload.desc = desc.trim();
      payload.scope = scope.trim();
      payload.org = org.trim();
    }
    if (category === 'ui') {
      payload.caseStudyUrl = caseStudyUrl.trim();
    }
    if (category === 'video') {
      payload.tools = tools;
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#27272a]">
          <h3 className="text-lg font-bold font-display text-white">
            {project ? 'Edit Project Details' : 'Add New Project'}
          </h3>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 grow">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Project Title</label>
              <input
                type="text"
                required
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Campaign Reveal"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Tag / Platform</label>
              <input
                type="text"
                required
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Instagram Post"
              />
            </div>
          </div>

          {/* Snd uploader wrapper */}
          <ImageUploader
            section={`work-${category}`}
            value={image}
            onChange={setImage}
            placeholder={category === 'social' ? 'svg:social-1' : category === 'print' ? 'svg:print-1' : category === 'ui' ? 'svg:ui-1' : category === 'reels' ? 'svg:reels-1' : category === 'video' ? 'svg:video-1' : 'svg:branding-1'}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Project Destination URL</label>
            <input
              type="text"
              className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. https://behance.net/..."
            />
          </div>

          {/* Conditional Layouts based on category */}
          {category === 'branding' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Branding Scope</label>
                  <input
                    type="text"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="e.g. Logo & Guideline specs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Organization</label>
                  <input
                    type="text"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. IIT Bombay"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Brand Description</label>
                <textarea
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  style={{ minHeight: '80px' }}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Explain system guidelines and apparel Mockups..."
                />
              </div>
            </>
          )}

          {category === 'ui' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">UX Case Study URL</label>
              <input
                type="text"
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={caseStudyUrl}
                onChange={(e) => setCaseStudyUrl(e.target.value)}
                placeholder="e.g. https://behance.net/case-study-details"
              />
            </div>
          )}

          {category === 'video' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Tools Used</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="grow bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTool(e)}
                  placeholder="e.g. Premiere Pro (Press Enter to add)"
                />
                <button
                  type="button"
                  onClick={handleAddTool}
                  className="bg-[#27272a] border border-[#3f3f46] hover:bg-[#3f3f46] text-white p-2 rounded transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#4f46e5]/10 border border-[#4f46e5]/30 text-[#6366f1] px-2 py-0.5 rounded-full"
                  >
                    {t}
                    <button type="button" onClick={() => handleRemoveTool(t)} className="hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Publish vs Draft Status */}
          <div className="flex justify-between items-center p-3 bg-[#09090b]/60 border border-[#27272a] rounded">
            <div className="text-xs">
              <p className="text-white font-medium">Visibility Status</p>
              <p className="text-[#71717a]">If set to draft, visitors won't see this card.</p>
            </div>
            <select
              className="bg-[#18181b] border border-[#27272a] rounded text-xs text-white p-2 focus:outline-none focus:border-[#6366f1]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="published">Published</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>
        </form>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#27272a] bg-[#18181b]">
          <button
            type="button"
            className="text-xs px-4 py-2 border border-[#27272a] rounded text-[#a1a1aa] hover:text-white transition-colors"
            onClick={onClose}
          >
            Discard
          </button>
          <button
            type="button"
            className="text-xs px-5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded transition-colors"
            onClick={handleSubmit}
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
}
