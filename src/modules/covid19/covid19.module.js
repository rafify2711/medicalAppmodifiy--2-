import express from 'express';
import covid19Controller from './covid19.controller.js';

const router = express.Router();

router.use('/covid19', covid19Controller);

export default router;
