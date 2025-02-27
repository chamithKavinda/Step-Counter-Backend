import express from 'express';
import { saveSteps , getSteps , getDailySteps} from '../controllers/StepController';

const router = express.Router();

router.post('/', saveSteps);
router.get('/', getSteps);
router.get('/daily', getDailySteps);

export default router;