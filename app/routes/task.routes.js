const taskController = require("../controllers/task.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

router.route("/list-all").get(taskController.listTasks);

router.route("/add").post(authenticateToken, checkUserRole('manager'),taskController.addTask);

router.route("/edit/:taskId").put(authenticateToken, checkUserRole('manager'),taskController.editTask);

router.route("/update-status/:taskId").put(taskController.updateTaskStatus);

router.route("/delete/:taskId").delete(authenticateToken, checkUserRole('manager'),taskController.deleteTask);


module.exports = router


