
import { Router } from 'express'
import * as registrationService from './service/registration.service.js';
import { validation } from '../../middleware/validation.middleware.js';
import * as validators from "./auth.validation.js"
const router = Router();




router.post("/signup",validation(validators.signup), registrationService.signup)
router.post("/login",validation(validators.login), registrationService.login)

export default router 