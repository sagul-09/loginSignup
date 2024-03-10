import express from 'express';
import {signUp,login} from '../controller/authController.js';

const authRouter  = express.Router();

authRouter.route('/signup').post(signUp);
authRouter.route('/login').post(login);

export default authRouter;