import express from 'express';
import kidneystoneController from './kidney-stone.controller.js';

const router = express.Router();

router.use('/kidneystone', kidneystoneController);

export default router;