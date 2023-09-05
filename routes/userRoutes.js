import express from "express";
import {
  register,
  confirmation,
  authentication,
  forgotPassword,
  checkToken,
  newPassword,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register);
router.get("/account-confirmation/:token", confirmation);
router.post("/login", authentication);
router.post("/forgot-password", forgotPassword);
router.route("/forgot-password/:token").get(checkToken).post(newPassword);
export default router;
