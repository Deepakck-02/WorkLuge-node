const controller = require("../controllers/portfolio.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

// API to get all portfolio as html
router.route("/list").get(controller.PortfolioList);

// API to get all portfolio
router.route("/list-all").get(controller.getPortfolioList);

// API to get names and ids
router.route("/get-list").get(controller.getPortfolioNames);

// API to get a single portfolio
router.route("/get-one/:portfolioId").get(controller.getPortfolioById);

// API to add a portfolio
router.route("/add").post(authenticateToken, checkUserRole('manager'),controller.addPortfolio);

// API to update a portfolio
router.route("/update/:portfolioId").put(authenticateToken, checkUserRole('manager'),controller.updatePortfolio);

// APi to update the status of a portfolio
router.route("/update-status/:portfolioId").put(controller.updatePortfolioStatus);

// API to delete a portfolio
router.route("/delete").delete(authenticateToken, checkUserRole('manager'),controller.deletePortfolio);

// API to add projects in a portfolio
router.route("/add-project/:portfolioId").post(authenticateToken, checkUserRole('manager'),controller.addProjectIdsToPortfolio);

// API to delete the projects in a portfolio
router.route("/delete-project/:portfolioId").post(authenticateToken, checkUserRole('manager'),controller.deleteProjectIdsFromPortfolio);


module.exports = router


