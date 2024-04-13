import express, { Router } from 'express';
import categoryController from '../controllers/categoryController';
import authMiddleware, { Role } from '../middleware/authMiddleware';

const router: Router = express.Router()

router.route('/')
    .post(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), categoryController.addCategory)
    .get(categoryController.getCategory)
router.route('/:id')
    .delete(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), categoryController.deleteCategory)
    .patch(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), categoryController.updateCategory)




export default router 
