const db = require("../models");
const Task = db.task;


// API for adding task
exports.addTask = async (req, res) => {
    try {
        console.log("called add task");

        const {
            status,
            assignee,
            planHours,
            duration,
            startOn,
            dueOn,
            taskName,
            description,
            createdBy,
            projectID
        } = req.body;

        // Generate unique taskId
        const taskId = await generateTaskId();

        const newTask = new Task({
            taskId,
            status,
            assignee,
            planHours,
            duration,
            startOn,
            dueOn,
            taskName,
            description,
            createdBy,
            projectID
        });

        await newTask.save();

        res.status(201).json({ message: 'Successfully added', taskId });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// API for listing tasks
exports.listTasks = async (req, res) => {
    try {
        console.log('called list all tasks');
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for editing tasks
exports.editTask = async (req, res) => {
    try {
        console.log('called edit task');
        const { taskId } = req.params;
        const updatedTask = req.body;

        const task = await Task.findOneAndUpdate(
            { taskId: taskId },
            updatedTask,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for updating the task status
exports.updateTaskStatus = async (req, res) => {
    try {
        console.log('called update task status');
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findOneAndUpdate(
            { taskId: taskId },
            { status: status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task status updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// API for task deletion
exports.deleteTask = async (req, res) => {
    try {
        console.log('called delete task');
        const { taskId } = req.params;

        const task = await Task.findOneAndDelete({ taskId: taskId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Function to generate unique task ID
async function generateTaskId() {
    const lastTask = await Task.findOne({}, {}, { sort: { taskId: -1 } });

    if (lastTask) {
        const lastId = parseInt(lastTask.taskId);
        return (lastId + 1).toString().padStart(4, "0");
    }

    return "0001";
}

