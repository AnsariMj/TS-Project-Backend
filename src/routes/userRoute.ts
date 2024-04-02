import express, { Router } from 'express'
import AuthController from '../controllers/userController'
const router: Router = express.Router()


router.route("/register").post(AuthController.registerUser)
router.route("/login").post(AuthController.LoginUser)


export default router 