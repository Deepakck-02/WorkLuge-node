const db = require("../models");
const People = db.people;


// API for adding people
exports.addPeople = async (req, res) => {
    try {
        console.log('called add people');

        const {
            name,
            email,
            phone,
            address,
            isActive,
            accessLevel,
            jobInfo,
            createdByID,
        } = req.body;

        // Generate unique peopleId
        const peopleId = await generatePeopleId();

        const newPeople = new People({
            peopleId,
            name,
            email,
            phone,
            address,
            isActive,
            accessLevel,
            jobInfo,
            createdByID,
        });

        await newPeople.save();

        res.status(201).json({ message: 'Successfully added', peopleId });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// API for listing people
exports.listPeople = async (req, res) => {
    try {
        console.log('called list all people');

        const people = await People.find();

        res.status(200).json({ people });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for listing people by peopleId
exports.getPersonById = async (req, res) => {
    try {
        console.log('called list people by id');

        const { peopleId } = req.params;
        const person = await People.findOne({ peopleId });

        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.status(200).json({ person });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for updating a person
exports.updatePerson = async (req, res) => {
    try {
        console.log('called update people');

        const { peopleId } = req.params;
        const updatedPerson = req.body;

        const person = await People.findOneAndUpdate({ peopleId }, updatedPerson, { new: true });

        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.status(200).json({ message: 'Person updated successfully', person });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//API for updating status of a person
exports.updatePersonStatus = async (req, res) => {
    try {
        console.log('called status update in people');

        const { peopleId } = req.params;
        const { isActive } = req.body;

        const updatedPerson = { isActive: isActive };

        const person = await People.findOneAndUpdate(
            { peopleId },
            updatedPerson,
            { new: true }
        );

        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.status(200).json({ message: 'Person status updated successfully', person });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// API for deleting a person
exports.deletePerson = async (req, res) => {
    try {
        console.log('called delete people');

        const { peopleId } = req.params;

        const deletedPerson = await People.findOneAndDelete({ peopleId });

        if (!deletedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





// Function to generate unique people ID
async function generatePeopleId() {
    const lastPeople = await People.findOne({}, {}, { sort: { peopleId: -1 } });

    if (lastPeople) {
        const lastId = parseInt(lastPeople.peopleId);
        return (lastId + 1).toString().padStart(4, "0");
    }

    return "0001";
}
