const projectController = require("../controllers/project.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

router.route("/list-all").get(projectController.getProjectList);

router.route("/get-one/:projectId").get(projectController.getProjectDetails);

router.route("/add").post(authenticateToken, checkUserRole('manager'),projectController.addProject);

router.route("/update/:projectId").put(authenticateToken, checkUserRole('manager'),projectController.updateProject);

router.route("/update-status/:projectId").put(projectController.updateProjectStatus);

router.route("/delete/:projectId").delete(authenticateToken, checkUserRole('manager'),projectController.deleteProject);


module.exports = router


