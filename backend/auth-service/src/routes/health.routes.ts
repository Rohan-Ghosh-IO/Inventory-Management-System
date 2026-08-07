import express from 'express';

import {
  getHealthStatusController,
  getReadinessStatusController,
} from '../controllers/health.controller';

const router = express.Router();

router.get('/health', getHealthStatusController);
router.get('/readiness', getReadinessStatusController);
router.get('/health/readiness', getReadinessStatusController);

export default router;
