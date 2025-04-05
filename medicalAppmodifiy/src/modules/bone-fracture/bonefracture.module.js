import express from 'express';
import bonefractureController from './bonefracture.controller.js';

const router = express.Router();

router.use('/bone-fracture', bonefractureController);

export default router;