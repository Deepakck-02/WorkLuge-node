const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        taskId: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        assignee: {
            type: String,
            required: true,
        },
        planHours: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        startOn: {
            type: Date,
            required: true,
        },
        dueOn: {
            type: Date,
            required: true,
        },
        taskName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        createdBy: {
            _id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
        projectID: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
