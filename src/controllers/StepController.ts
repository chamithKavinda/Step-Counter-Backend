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

const getWeeklySteps = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const stepData = await prisma.stepData.findMany({
            where: { userId, date: { gte: sevenDaysAgo } }
        });

        const dailySteps: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const dayString = date.toISOString().split('T')[0];
            dailySteps[dayString] = 0;
        }

        stepData.forEach(entry => {
            const dayString = entry.date.toISOString().split('T')[0];
            if (dailySteps[dayString] !== undefined) {
                dailySteps[dayString] += entry.steps;
            }
        });

        const weeklyData = Object.entries(dailySteps).map(([date, steps]) => ({ date, steps }));
        weeklyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        res.json({ weeklyData });
    } catch (error) {
        console.error('Get weekly steps error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { saveSteps , getSteps , getDailySteps , getWeeklySteps};