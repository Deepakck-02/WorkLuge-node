const peopleController = require('../controllers/people.controller');
const express = require('express');
const {authenticateToken, checkUserRole} = require("../middleware/jwtVerification");

const router = express.Router();

// API to get all people as html
router.get('/get-all', peopleController.getAllPeople);

// API to get all people
router.route('/list-all').post(peopleController.listPeople);

// API to get all users with access level as user
router.route('/list-users').get(peopleController.listUsers);

// API to get all users with access level as manager
router.route('/list-manager').get(peopleController.listManager);

// API to get a single user
router.route('/get-one/:peopleId').get(peopleController.getPersonById);

// API to add people
router.route('/add').post(authenticateToken, checkUserRole('manager'), peopleController.addPeople);

// API to update people
router.route('/update/:peopleId').put(authenticateToken, checkUserRole('manager'),peopleController.updatePerson);

// API to update the status of a user
router.route('/update-status/:peopleId').put(peopleController.updatePersonStatus);

// API to delete a person
router.route('/delete/:peopleId').delete(authenticateToken, checkUserRole('manager'),peopleController.deletePerson);

module.exports = router;
