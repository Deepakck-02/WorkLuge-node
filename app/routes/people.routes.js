const peopleController = require('../controllers/people.controller');
const express = require('express');

const router = express.Router();

router.route('/list-all').get(peopleController.listPeople);

router.route('/get-one/:peopleId').get(peopleController.getPersonById);

router.route('/add').post(peopleController.addPeople);

router.route('/update/:peopleId').put(peopleController.updatePerson);

router.route('/update-status/:peopleId').put(peopleController.updatePersonStatus);

router.route('/delete/:peopleId').delete(peopleController.deletePerson);

module.exports = router;
