import express from 'express';
import braintumorController from './brain-tumor.controller.js';

const router = express.Router();

router.use('/braintumor', braintumorController);

export default router;