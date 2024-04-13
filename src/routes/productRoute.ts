import express, { Router } from 'express';
import productController from '../controllers/productController';
import authMiddleware, { Role } from '../middleware/authMiddleware';
import { multer, storage } from '../middleware/multerMiddeware';
const upload = multer({ storage: storage })
const router: Router = express.Router()

router.route("/")
    .post(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), upload.single('image'), productController.addProduct)
    .get(productController.getAllProducts)
router.route("/:id").get(productController.getSingelProduct).delete(authMiddleware.isAthenticated, authMiddleware.restrictTo(Role.Admin), productController.deleteProduct)

export default router 
