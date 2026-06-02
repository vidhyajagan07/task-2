import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mini CRM backend is running.' });
});

const createDefaultAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (!existing) {
      const password = process.env.ADMIN_PASSWORD || 'Admin@123';
      const hashed = await bcrypt.hash(password, 10);
      await Admin.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashed,
      });
      console.log('Default admin user created: admin / Admin@123');
    }
  } catch (error) {
    console.error('Failed to seed admin', error);
  }
};

connectDB().then(() => {
  createDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
