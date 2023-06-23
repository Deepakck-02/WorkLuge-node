const controller = require("../controllers/auth.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

// API to signup
router.route("/register").post(controller.register);

// API to login
router.route("/login").post(controller.login);

// API to get all users
router.route("/get-all").get(controller.getAllUsers);

// API to delete a user
router.route("/delete/:userId").delete(authenticateToken, checkUserRole('manager'),controller.deleteUser);


module.exports = router