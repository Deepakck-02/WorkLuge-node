const projectController = require("../controllers/project.controller");
const express = require('express')

const router = express.Router()

router.route("/list-all").get(projectController.getProjectList);

router.route("/get-one/:projectId").get(projectController.getProjectDetails);

router.route("/add").post(projectController.addProject);

router.route("/update/:projectId").put(projectController.updateProject);

router.route("/update-status/:projectId").put(projectController.updateProjectStatus);

router.route("/delete/:projectId").delete(projectController.deleteProject);


module.exports = router


