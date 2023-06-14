const controller = require("../controllers/portfolio.controller");
const express = require('express')
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router()

router.route("/list-all").get(controller.getPortfolioList);

router.route("/get-one/:portfolioId").get(controller.getPortfolioById);

router.route("/add").post(authenticateToken, checkUserRole('manager'),controller.addPortfolio);

router.route("/update/:portfolioId").put(authenticateToken, checkUserRole('manager'),controller.updatePortfolio);

router.route("/update-status/:portfolioId").put(controller.updatePortfolioStatus);

router.route("/delete/:portfolioId").delete(authenticateToken, checkUserRole('manager'),controller.deletePortfolio);

router.route("/add-project/:portfolioId").post(authenticateToken, checkUserRole('manager'),controller.addProjectIdsToPortfolio);

router.route("/delete-project/:portfolioId").post(authenticateToken, checkUserRole('manager'),controller.deleteProjectIdsFromPortfolio);


module.exports = router


