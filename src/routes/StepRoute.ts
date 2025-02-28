import express from 'express';
import { saveSteps , getSteps , getDailySteps , getWeeklySteps} from '../controllers/StepController';

const router = express.Router();

router.post('/', saveSteps);
router.get('/', getSteps);
router.get('/daily', getDailySteps);
router.get('/weekly', getWeeklySteps);

export default router;