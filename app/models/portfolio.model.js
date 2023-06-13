const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        portfolioId: {
            type: String,
            unique: true,
            required: true
        },
        portfolioDescription: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive"
        },
        portfolioManager: {
            _id: {
                type: String,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
        portfolioName: {
            type: String,
            required: true
        },
        projectId: {
            ids: [{
                type: String,
                ref: "Project"
            }]
        }
    },
    { timestamps: true } // Enable timestamps option
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
