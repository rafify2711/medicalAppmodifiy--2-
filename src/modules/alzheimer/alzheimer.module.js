import express from 'express';
import alzheimerController from './alzheimer.controller.js';

const router = express.Router();

router.use('/alzheimer', alzheimerController);

export default router;