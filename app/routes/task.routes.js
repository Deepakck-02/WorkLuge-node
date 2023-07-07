const taskController = require("../controllers/task.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

// API to get all task as html
router.route("/get-all-task").get(taskController.getAlltask );

// API to get a task by id
router.route("/get-one/:taskId").get(taskController.getTaskById );

// API to get all tasks
router.route("/list-all").post(taskController.listTasks);

// API to get task names and ids
router.route("/get-list").get(taskController.listTaskNames);

// APi to add a task
router.route("/add").post(authenticateToken, checkUserRole('manager'),taskController.addTask);

// API to add and update assignee in task
router.route("/add-assignee").post(authenticateToken, checkUserRole('manager'),taskController.addAssignee);

// API to update assignees in a task
router.route("/update-assignee").post(authenticateToken, checkUserRole('manager'),taskController.updateAssignees);

// API to remove the selected assignees
router.route("/remove-assignee").post(authenticateToken, checkUserRole('manager'),taskController.removeAssignees );

// API to edit a task
router.route("/edit/:taskId").put(authenticateToken, checkUserRole('manager'),taskController.editTask);

// API to update the status of a task
router.route("/update-status/:taskId").put(taskController.updateTaskStatus);

// API to delete a task
router.route("/delete/").post(authenticateToken, checkUserRole('manager'),taskController.deleteTasks);


module.exports = router


