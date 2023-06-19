const peopleController = require('../controllers/people.controller');
const express = require('express');
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router();

router.route('/list-all').get(peopleController.listPeople);

router.route('/list-users').get(peopleController.listUsers);

router.route('/get-one/:peopleId').get(peopleController.getPersonById);

router.route('/add').post(authenticateToken, checkUserRole('manager'), peopleController.addPeople);

router.route('/update/:peopleId').put(authenticateToken, checkUserRole('manager'),peopleController.updatePerson);

router.route('/update-status/:peopleId').put(peopleController.updatePersonStatus);

router.route('/delete/:peopleId').delete(authenticateToken, checkUserRole('manager'),peopleController.deletePerson);

module.exports = router;
