const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        projectId: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        projectName: {
            type: String,
            required: true,
        },
        projectDescription: {
            type: String,
            required: true,
        },
        projectDuration: {
            type: Number,
            default: 0,
        },
        portfolioId: {
            type: String,
            ref: "Portfolio",
            required: true,
        },
        projectOwner: {
            _id: {
                type: String,
                ref: "User",
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
        projectedStartDate: {
            type: Date,
            required: true,
        },
        projectedCompletionDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true } // Enable timestamps option
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
