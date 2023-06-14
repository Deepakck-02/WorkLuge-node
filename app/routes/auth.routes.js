const controller = require("../controllers/auth.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

router.route("/register").post(controller.register);

router.route("/login").post(controller.login);

router.route("/get-all").get(controller.getAllUsers);

router.route("/delete/:userId").delete(authenticateToken, checkUserRole('manager'),controller.deleteUser);


module.exports = router