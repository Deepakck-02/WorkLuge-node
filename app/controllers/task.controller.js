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
            projectId
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
            projectId
        });

        await newTask.save();

        res.status(201).json({ message: 'Successfully added', taskId });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// API dor adding assignee to task
exports.addAssignee = async (req, res) => {
    try {
        console.log("called add assignee");

        const { taskId, assignee } = req.body;

        // Find the task by taskId
        const task = await Task.findOne({ taskId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the assignee field with the new value
        task.assignee = assignee;

        // Save the updated task to the database
        await task.save();

        res.status(200).json({ message: 'Assignee added successfully', taskId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for listing tasks

// exports.listTasks = async (req, res) => {
//     try {
//         console.log('called list all tasks');
//         const tasks = await Task.find();
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.listTasks = async (req, res) => {
    try {
        console.log('called list all tasks');

        const onset = parseInt(req.body.onset); // Get the onset (starting index)
        const offset = parseInt(req.body.offset); // Get the offset (number of tasks to retrieve)

        const tasks = await Task.aggregate([
            {
                $lookup: {
                    from: 'projects',
                    localField: 'projectId',
                    foreignField: 'projectId',
                    as: 'project'
                }
            },
            {
                $unwind: '$project'
            },
            {
                $project: {
                    assignee: 1,
                    createdBy: 1,
                    _id: 1,
                    taskId: 1,
                    status: 1,
                    planHours: 1,
                    duration: 1,
                    startOn: 1,
                    dueOn: 1,
                    taskName: 1,
                    description: 1,
                    'project.id': '$project.projectId',
                    'project.name': '$project.projectName',
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            },
            {
                $skip: onset
            },
            {
                $limit: offset
            }
        ]);

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// API to get ids and names
exports.listTaskNames = async (req, res) => {
    try {
        console.log('called list task names');
        const tasks = await Task.aggregate([
            {
                $project: {
                    _id: 0,
                    taskId: 1,
                    taskName: 1
                }
            }
        ]);

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


// API to list as html
exports.getAlltask = async (req, res) => {
    try {
        console.log('called list all tasks');
        const tasks = await Task.aggregate([
            {
                $lookup: {
                    from: 'projects', // The name of the project collection
                    localField: 'projectId',
                    foreignField: 'projectId',
                    as: 'project'
                }
            },
            {
                $unwind: '$project'
            },
            {
                $project: {
                    assignee: 1,
                    createdBy: 1,
                    _id: 1,
                    taskId: 1,
                    status: 1,
                    planHours: 1,
                    duration: 1,
                    startOn: 1,
                    dueOn: 1,
                    taskName: 1,
                    description: 1,
                    'project.id': '$project.projectId',
                    'project.name': '$project.projectName',
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]);
        res.render('task', { tasks });
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

