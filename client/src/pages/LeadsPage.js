import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import LeadTable from '../components/LeadTable.js';
import { fetchLeads, createLead, updateLead, deleteLead, addLeadNote } from '../services/api.js';

const LeadForm = ({ lead, onChange, onSave, onCancel }) => {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h2>{lead._id ? 'Edit Lead' : 'Add Lead'}</h2>
      <div className="input-group">
        <label>Name</label>
        <input name="name" value={lead.name} onChange={onChange} placeholder="Full name" />
      </div>
      <div className="input-group">
        <label>Email</label>
        <input name="email" value={lead.email} onChange={onChange} placeholder="email@example.com" />
      </div>
      <div className="input-group">
        <label>Phone</label>
        <input name="phone" value={lead.phone} onChange={onChange} placeholder="(555) 555-5555" />
      </div>
      <div className="input-group">
        <label>Source</label>
        <select name="source" value={lead.source} onChange={onChange}>
          <option>Website</option>
          <option>Referral</option>
          <option>Social Media</option>
          <option>Email Campaign</option>
        </select>
      </div>
      <div className="input-group">
        <label>Status</label>
        <select name="status" value={lead.status} onChange={onChange}>
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>
      </div>
      <div className="actions">
        <button className="button" type="button" onClick={onSave}>
          Save Lead
        </button>
        {lead._id && (
          <button className="button secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, newLeads: 0, contacted: 0, converted: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', source: '' });
  const [activeLead, setActiveLead] = useState({ name: '', email: '', phone: '', source: 'Website', status: 'New' });
  const [noteText, setNoteText] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadLeads = async () => {
    setError('');
    try {
      const data = await fetchLeads(filters);
      setLeads(data.leads);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const handleChange = (e) => {
    setActiveLead({ ...activeLead, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (activeLead._id) {
        await updateLead(activeLead._id, activeLead);
      } else {
        await createLead(activeLead);
      }
      setActiveLead({ name: '', email: '', phone: '', source: 'Website', status: 'New' });
      setSelectedLead(null);
      loadLeads();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelect = (lead) => {
    setActiveLead({ ...lead });
    setSelectedLead(lead);
  };

  const handleAddNote = async (id, text) => {
    if (!text.trim()) return;
    try {
      await addLeadNote(id, { text });
      setNoteText('');
      loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLead = useMemo(() => leads.find((item) => item._id === selectedLead?._id), [leads, selectedLead]);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-panel">
        <div className="header-row">
          <div>
            <h1>Lead Management</h1>
            <p className="text-muted">Add, update, and convert leads with quick follow-ups.</p>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 20 }}>
          <div className="card">
            <h3>Total Leads</h3>
            <p>{stats.total}</p>
          </div>
          <div className="card">
            <h3>Contacted</h3>
            <p>{stats.contacted}</p>
          </div>
          <div className="card">
            <h3>Converted</h3>
            <p>{stats.converted}</p>
          </div>
        </div>

        <LeadForm
          lead={activeLead}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={() => {
            setActiveLead({ name: '', email: '', phone: '', source: 'Website', status: 'New' });
            setSelectedLead(null);
          }}
        />

        <section className="card">
          <div className="header-row" style={{ marginBottom: 18 }}>
            <div>
              <h2>Leads</h2>
              <p className="text-muted">Search and filter your pipeline.</p>
            </div>
            <div className="actions">
              <input
                className="input-group"
                style={{ width: 200 }}
                placeholder="Search by name or email"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
              <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
                <option value="">All sources</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Email Campaign">Email Campaign</option>
              </select>
            </div>
          </div>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          <LeadTable leads={leads} onDelete={handleDelete} onSelect={handleSelect} onAddNote={handleAddNote} />

          {filteredLead && (
            <div className="note-section card">
              <h3>Note History for {filteredLead.name}</h3>
              <div className="note-box">
                <textarea
                  rows="3"
                  style={{ flex: 1 }}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write a follow-up note"
                />
                <button className="button" type="button" onClick={() => handleAddNote(filteredLead._id, noteText)}>
                  Add Note
                </button>
              </div>
              {filteredLead.notes.length ? (
                filteredLead.notes.map((note) => (
                  <div className="note-item" key={note._id || note.createdAt}>
                    <p>{note.text}</p>
                    <time>{new Date(note.createdAt).toLocaleString()}</time>
                  </div>
                ))
              ) : (
                <p className="text-muted">No notes yet.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default LeadsPage;
