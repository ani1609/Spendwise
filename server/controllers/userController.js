const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { SECRET_KEY, SALT } = process.env;

const login=async(req,res)=>
{
    try
    {
        const {email,password}=req.body;
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(401).send({message:"invalid email or password"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch)
        {
            return res.status(401).send({message:"invalid email or password"});
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({ token });
    }
    catch(error)
    {
        return res.status(500).send({message:"Internal Server Error"});
    }
};

const signup = async (req, res) => 
{
    try
    {
        const user = await User.findOne({ email: req.body.email });
        if (user) 
        {
            return res.status(409).send({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(Number(SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = await new User({ ...req.body, password: hashedPassword }).save();

        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '7d' });
        res.status(201).send({user:newUser, token: token});

    }
    catch (error) 
    {
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

function authenticateJWT(req, res, next) 
{
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) 
    {
        return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => 
    {
        if (err) 
        {
        return res.status(403).json({ message: 'Authentication failed: Invalid token.' });
        }
        User.findOne({ _id: decoded.id })
            .then(user => 
            {
                req.user = user;
                next();
            })
            .catch(error => 
                {
                return res.status(500).json({ message: 'Internal Server Error' });
            });
    });
}


module.exports = {
    login,
    signup,
    authenticateJWT
};
