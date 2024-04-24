import express, { Router } from 'express'
import orderController from '../controllers/orderController'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import errorHandler from '../servies/catchAsyncError'

const router: Router = express.Router()

router.route('/').post(authMiddleware.isAthenticated, errorHandler(orderController.createOrder))
router.route('/verify').post(authMiddleware.isAthenticated, errorHandler(orderController.verifyTransaction))
router.route('/details').get(authMiddleware.isAthenticated, errorHandler(orderController.fetchMyOrders))


router.route('/details/:id')
    .patch(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.customer), errorHandler(orderController.cancellMyOrder))
    .get(authMiddleware.isAthenticated, errorHandler(orderController.fetchMyOrderDetails))


router.route('/admin/:id')
    .patch(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), errorHandler(orderController.changeOrderStatus))
    .delete(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), errorHandler(orderController.deleteOrder))

router.route('/admin/payment/:id')
    .patch(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), errorHandler(orderController.changePaymentStatus))

export default router
