
import { Router } from 'express'
import * as registrationService from './service/registration.service.js';
import { logout } from './service/logout.service.js';
import { validation } from '../../middleware/validation.middleware.js';
import * as validators from "./auth.validation.js"
const router = Router();




router.post("/signup",validation(validators.signup), registrationService.signup)
router.post("/login",validation(validators.login), registrationService.login)
router.post('/forgot-password',validation(validators.forgotPassword) ,registrationService.forgotPassword);
router.post('/reset-password/:token',validation(validators.resetPassword) ,registrationService.resetPassword);
router.post("/logout", logout);

export default router 