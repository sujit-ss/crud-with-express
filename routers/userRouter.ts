import { routes } from "../config/routes";
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { jwtAuthentication } = require("../middlewares/jwtAuthorization");

router.post(routes.signup, userController.signupUser);
router.post(routes.login, userController.loginUser);
router.get(routes.logout, jwtAuthentication, userController.logoutUser);
router.get(
  routes.users,
  jwtAuthentication,
  userController.getUserDetails
);

module.exports = router;
