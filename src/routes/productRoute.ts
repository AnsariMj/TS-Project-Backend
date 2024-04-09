import express, { Router } from 'express';
import productController from '../controllers/productController';
import { multer, storage } from '../middleware/multerMiddeware';
const upload = multer({ storage: storage })
const router: Router = express.Router()

router.route("/").post(upload.single('image'), productController.addProduct)
export default router;