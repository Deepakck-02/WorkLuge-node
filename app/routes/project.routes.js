const projectController = require("../controllers/project.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

// API to get all projects as html
router.route("/list").get(projectController.ProjectList);

// API to get project names and ids
router.route("/get-list").get(projectController.getProjectNames);

// API to get all projects
router.route("/list-all").get(projectController.getProjectList);

// API to get a single project
router.route("/get-one/:projectId").get(projectController.getProjectDetails);

// API to add a project
router.route("/add").post(authenticateToken, checkUserRole('manager'),projectController.addProject);

// API to update a project
router.route("/update/:projectId").put(authenticateToken, checkUserRole('manager'),projectController.updateProject);

// API to update the status of a project
router.route("/update-status/:projectId").put(projectController.updateProjectStatus);

// API to delete a project
router.route("/delete/:projectId").delete(authenticateToken, checkUserRole('manager'),projectController.deleteProject);


module.exports = router


