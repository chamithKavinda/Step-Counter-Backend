import { RequestHandler, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/customTypes';

const authenticateToken: RequestHandler = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Authentication token required' });
        return; // Ensure the function exits after sending the response
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = user as CustomRequest["user"];
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return; // Ensure the function exits after sending the response
    }
};

export { authenticateToken };
