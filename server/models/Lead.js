import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  source: { type: String, default: 'Website', trim: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted'],
    default: 'New',
  },
  notes: [NoteSchema],
}, { timestamps: true });

const Lead = mongoose.model('Lead', LeadSchema);
export default Lead;
