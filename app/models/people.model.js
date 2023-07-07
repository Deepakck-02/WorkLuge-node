const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema(
    {
        peopleId: {
            type: String,
            unique: true,
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
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        accessLevel: {
            type: String,
            enum: ['user', 'manager'],
            required: true,
        },
        jobInfo: {
            type: String,
            required: true,
        },
        createdByID: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const People = mongoose.model('People', peopleSchema);

module.exports = People;
