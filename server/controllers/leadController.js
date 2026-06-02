import Lead from '../models/Lead.js';

export const getLeads = async (req, res) => {
  const { search, status, source } = req.query;
  const query = {};

  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });
  const total = await Lead.countDocuments();
  const converted = await Lead.countDocuments({ status: 'Converted' });
  const contacted = await Lead.countDocuments({ status: 'Contacted' });
  const newLeads = await Lead.countDocuments({ status: 'New' });

  const sourceStats = await Lead.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } },
  ]);

  res.json({ leads, stats: { total, newLeads, contacted, converted, sourceStats } });
};

export const createLead = async (req, res) => {
  const { name, email, phone, source, status } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const lead = await Lead.create({ name, email, phone, source, status });
  res.status(201).json(lead);
};

export const updateLead = async (req, res) => {
  const { id } = req.params;
  const updated = await Lead.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'Lead not found.' });
  }
  res.json(updated);
};

export const deleteLead = async (req, res) => {
  const { id } = req.params;
  const removed = await Lead.findByIdAndDelete(id);
  if (!removed) {
    return res.status(404).json({ message: 'Lead not found.' });
  }
  res.json({ message: 'Lead deleted.' });
};

export const addNote = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Note text is required.' });
  }

  const lead = await Lead.findById(id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }

  lead.notes.unshift({ text });
  await lead.save();
  res.status(201).json(lead);
};
