import express, { Router } from 'express'
import orderController from '../controllers/orderController'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import errorHandler from '../servies/catchAsyncError'

const router: Router = express.Router()

router.route('/').post(authMiddleware.isAthenticated, errorHandler(orderController.createOrder))
router.route('/verify').post(authMiddleware.isAthenticated, errorHandler(orderController.verifyTransaction))
router.route('/details').get(authMiddleware.isAthenticated, errorHandler(orderController.fetchMyOrders))

router.route('/details/:id')
    .get(authMiddleware.isAthenticated, errorHandler(orderController.fetchMyOrderDetails))
    .patch(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.customer), errorHandler(orderController.cancellMyOrder))

export default router
