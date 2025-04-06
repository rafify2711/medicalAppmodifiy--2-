import express from 'express';
import skincancerController from './skin-cancer.controller.js';

const router = express.Router();

router.use('/skincancer', skincancerController);

export default router;
