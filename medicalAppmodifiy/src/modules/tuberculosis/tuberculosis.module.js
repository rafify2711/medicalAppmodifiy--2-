import express from 'express';
import tuberculosisController from './tuberculosis.controller.js';

const router = express.Router();

router.use('/tuberculosis', tuberculosisController);

export default router;
