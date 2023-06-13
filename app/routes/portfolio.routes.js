const controller = require("../controllers/portfolio.controller");
const express = require('express')

const router = express.Router()

router.route("/list-all").get(controller.getPortfolioList);

router.route("/get-one/:portfolioId").get(controller.getPortfolioById);

router.route("/add").post(controller.addPortfolio);

router.route("/update/:portfolioId").put(controller.updatePortfolio);

router.route("/update-status/:portfolioId").put(controller.updatePortfolioStatus);

router.route("/delete/:portfolioId").delete(controller.deletePortfolio);

router.route("/add-project/:portfolioId").post(controller.addProjectIdsToPortfolio);

router.route("/delete-project/:portfolioId").post(controller.deleteProjectIdsFromPortfolio);


module.exports = router


