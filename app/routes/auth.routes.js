const controller = require("../controllers/auth.controller");
const express = require('express')

const router = express.Router()

router.route("/register").post(controller.register);

router.route("/login").post(controller.login);

router.route("/get-all").get(controller.getAllUsers);

router.route("/delete/:userId").delete(controller.deleteUser);


module.exports = router