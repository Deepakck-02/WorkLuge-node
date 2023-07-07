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

        const existingAssignees = task.assignee;
        const newAssignees = [];
        const alreadyExistingAssignees = [];

        // Check if each assignee from the payload already exists in the task
        for (const newAssignee of assignee) {
            const existingAssignee = existingAssignees.find(
                (assignee) => assignee.id === newAssignee.id
            );
            if (existingAssignee) {
                // Assignee already exists, add to alreadyExistingAssignees array
                alreadyExistingAssignees.push(existingAssignee);
                console.log(`Assignee ${newAssignee.id} already exists in the task`);
            } else {
                // Assignee is new, add to newAssignees array
                newAssignees.push(newAssignee);
            }
        }

        // Add the new assignees to the existing assignees array
        task.assignee = [...existingAssignees, ...newAssignees];

        // Save the updated task to the database
        await task.save();

        if (newAssignees.length > 0) {
            res.status(200).json({
                message: 'Assignees added successfully',
                taskId,
                newAssignees,
                alreadyExistingAssignees,
            });
        } else {
            res.status(200).json({
                message: 'No new assignees added',
                taskId,
                newAssignees,
                alreadyExistingAssignees,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for updating assignees
exports.updateAssignees = async (req, res) => {
    try {
        console.log("called update assignees");

        const { taskId, assignees } = req.body;

        // Find the task by taskId
        const task = await Task.findOne({ taskId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the assignees with the new value
        task.assignee = assignees;

        // Save the updated task to the database
        await task.save();

        res.status(200).json({ message: 'Assignees updated successfully', taskId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API to remove assignees
exports.removeAssignees = async (req, res) => {
    try {
        console.log("called remove assignees");

        const { taskId, assigneeIds } = req.body;

        // Find the task by taskId
        const task = await Task.findOne({ taskId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove the assignees with matching ids
        task.assignee = task.assignee.filter((assignee) => !assigneeIds.includes(assignee.id));

        // Save the updated task to the database
        await task.save();

        res.status(200).json({ message: 'Assignees removed successfully', taskId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for listing tasks
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
                $unwind: { path: "$project", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    assignee: { $ifNull: ["$assignee", []] }, // Handle tasks with no assignees
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

// API to get a single task
exports.getTaskById = async (req, res) => {
    try {
        console.log('called get task by ID');
        const { taskId } = req.params;

        const task = await Task.findOne({ taskId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
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
        console.log('called update task');
        const { taskId } = req.params;
        const updates = req.body;

        // Exclude assignee and createdBy fields from the updates
        delete updates.assignee;
        delete updates.createdBy;

        // Find the task by taskId and update its fields
        const updatedTask = await Task.findOneAndUpdate(
            { taskId },
            { $set: updates },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
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
exports.deleteTasks = async (req, res) => {
    try {
        console.log('called delete tasks');
        const { taskIds } = req.body;

        const existingTasks = await Task.find({ taskId: { $in: taskIds } });

        const existingTaskIds = existingTasks.map(task => task.taskId);
        const nonExistingTaskIds = taskIds.filter(taskId => !existingTaskIds.includes(taskId));

        await Task.deleteMany({ taskId: { $in: existingTaskIds } });

        if (existingTaskIds.length === 0) {
            return res.status(404).json({ message: 'Tasks not found' });
        }

        let message = 'Tasks deleted successfully';

        if (nonExistingTaskIds.length > 0) {
            message = 'Some tasks are not found, others are deleted if found any';
        }

        res.status(200).json({ message, nonExistingTaskIds });
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

