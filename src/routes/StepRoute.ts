import express from 'express';
import { saveSteps,getSteps} from '../controllers/StepController';

const router = express.Router();

router.post('/', saveSteps);
router.get('/', getSteps);

export default router;