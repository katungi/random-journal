import cors from 'cors';
import express from 'express';
import UserRoutes from './routes/user.routes';
import JournalRoutes from './routes/jot.routes';

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(UserRoutes);
app.use(JournalRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
