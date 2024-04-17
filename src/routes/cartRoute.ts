import express, { Router } from "express";
import cartController from "../controllers/cartController";
import authMiddleware from "../middleware/authMiddleware";
const router: Router = express.Router();

router.route("/")
    .post(authMiddleware.isAthenticated, cartController.addToCart)
    .get(authMiddleware.isAthenticated, cartController.getMyCarts);
router.route("/:productId")
    .delete(authMiddleware.isAthenticated, cartController.deleteCartItem)
    .patch(authMiddleware.isAthenticated, cartController.updadteCartItem)

export default router;