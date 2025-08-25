import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
import apiRoutes from './routes/index.js';
app.use('/api', apiRoutes);

export default app;
