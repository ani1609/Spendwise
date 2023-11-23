const mongoose = require('mongoose');
const Joi=require('joi');

const transactionSchema = new mongoose.Schema
({
    transactionType: 
    {
        type: String,
        required: true
    },
    category: 
    {
        type: String,
        required: true
    },
    date: 
    {
        type: Date,
        required: true

    },
    amount: 
    {
        type: Number,
        required: true

    },
    description: 
    {
        type: String,
        required: true

    }
});

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
    transactions: [transactionSchema]
});

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
}

module.exports = { User, validateUser };