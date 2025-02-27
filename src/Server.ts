import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoute';
import { authenticateToken } from './middlewares/AuthMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/steps', authenticateToken);

app.get('/', (req: Request, res: Response) => {
    res.send('Step Counter API is running');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
