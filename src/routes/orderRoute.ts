import express, { Router } from 'express'
import orderController from '../controllers/orderController'
import authMiddleware from '../middleware/authMiddleware'
import errorHandler from '../servies/catchAsyncError'

const router: Router = express.Router()

router.route('/')
    .post(authMiddleware.isAthenticated, errorHandler(orderController.createOrder))

export default router