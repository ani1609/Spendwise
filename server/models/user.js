const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema
({
    name:
    {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = { User};
