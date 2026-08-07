import express from 'express';

import { getHealthStatusController } from '../controllers/health.controller';

const router = express.Router();

router.get('/health', getHealthStatusController);

export default router;
