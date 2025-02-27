import express from 'express';
import { saveSteps } from '../controllers/StepController';

const router = express.Router();

router.post('/', saveSteps);

export default router;