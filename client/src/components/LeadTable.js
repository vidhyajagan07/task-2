import { useState } from 'react';

const LeadTable = ({ leads, onUpdateStatus, onDelete, onSelect, onAddNote }) => {
  const [noteText, setNoteText] = useState('');
  const [activeLeadId, setActiveLeadId] = useState(null);

  const handleAddNote = (lead) => {
    if (!noteText.trim()) return;
    onAddNote(lead._id, noteText);
    setNoteText('');
    setActiveLeadId(null);
  };

  return (
    <table className="lead-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Source</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.source}</td>
            <td>
              <span className={`status-chip ${lead.status.toLowerCase()}`}>
                {lead.status}
              </span>
            </td>
            <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
            <td className="actions">
              <button className="button secondary" type="button" onClick={() => onSelect(lead)}>
                Edit
              </button>
              <button className="button secondary" type="button" onClick={() => onDelete(lead._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeadTable;
