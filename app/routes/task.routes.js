const taskController = require("../controllers/task.controller");
const express = require('express')

const router = express.Router()

router.route("/list-all").get(taskController.listTasks);

router.route("/add").post(taskController.addTask);

router.route("/edit/:taskId").put(taskController.editTask);

router.route("/update-status/:taskId").put(taskController.updateTaskStatus);

router.route("/delete/:taskId").delete(taskController.deleteTask);


module.exports = router


