import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { CustomRequest } from '../types/customTypes';

const prisma = new PrismaClient();

const saveSteps = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { steps } = req.body;
        const userId = req.user.id;

        const stepData = await prisma.stepData.create({
            data: { steps, userId }
        });

        res.status(201).json({ message: 'Step data saved successfully', stepData });
    } catch (error) {
        console.error('Save steps error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSteps = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const stepData = await prisma.stepData.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });

        res.json({ stepData });
    } catch (error) {
        console.error('Get steps error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDailySteps = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stepData = await prisma.stepData.findMany({
            where: { userId, date: { gte: today } }
        });

        const totalSteps = stepData.reduce((sum, entry) => sum + entry.steps, 0);

        res.json({ date: today, totalSteps });
    } catch (error) {
        console.error('Get daily steps error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { saveSteps , getSteps ,getDailySteps};