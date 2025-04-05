import express from 'express';
import eye_diseasesController from './eye_diseases.controller';

const router = express.Router();

router.use('/eye-diseases', eye_diseasesController);

export default router;