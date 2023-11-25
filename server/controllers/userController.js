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

const fetchTransactions = async (req, res) =>
{
    try 
    {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
    
        if (!user) 
        {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ transactions: user.transactions });
    }
    catch (error) 
    {
        console.error(error);
    
        if (error.name === 'TokenExpiredError') 
        {
            return res.status(401).json({ message: "Token expired" });
        }
        else if(error.name === 'JsonWebTokenError')
        {
            return res.status(401).json({ message: "Invalid token" });
        }
        else
        {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const uploadTransactions = async (req, res) => 
{
    try 
    {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
    
        if (!user) 
        {
            return res.status(404).json({ message: "User not found" });
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let transactionId = '';
        for (let i = 0; i < 10; i++) 
        {
            const randomIndex = Math.floor(Math.random() * characters.length);
            transactionId += characters.charAt(randomIndex);
        }

        req.body.transactionId = transactionId;
        user.transactions.push(req.body);
        await user.save();
    
        res.status(200).json({ message: "Transaction uploaded successfully" });
    }
    catch (error) 
    {
        console.error(error);
    
        if (error.name === 'TokenExpiredError')
        {
            return res.status(401).json({ message: "Token expired" });
        }
        else if (error.name === 'JsonWebTokenError')
        {
            return res.status(401).json({ message: "Invalid token" });
        }
        else
        {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

const editTransaction = async (req, res) =>
{
    try
    {
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token,SECRET_KEY);
        const user=await User.findById(decoded.id);

        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }

        const { transactionId, transactionType, category, date, amount, description } = req.body;

        const transaction = user.transactions.find(
            (transaction) => transaction.transactionId === transactionId
        );

        if (!transaction) 
        {
            return res.status(404).json({ message: "Transaction not found" });
        }

        transaction.transactionType = transactionType;
        transaction.category = category;
        transaction.date = date;
        transaction.amount = amount;
        transaction.description = description;

        await user.save();

        res.status(200).json({ message: "Transaction updated successfully"});

    }
    catch(error)
    {
        console.error(error);

        if(error.name==='TokenExpiredError')
        {
            return res.status(401).json({message:"Token expired"});
        }
        else if(error.name==='JsonWebTokenError')
        {
            return res.status(401).json({message:"Invalid token"});
        }
        else
        {
            return res.status(500).json({message:"Internal Server Error"});
        }
    }
}

const deleteTransactcion = async (req, res) => 
{
    try
    {
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token,SECRET_KEY);
        const user=await User.findById(decoded.id);

        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }

        const transactionIdToDelete = req.body.transactionId;

        const transactionIndex = user.transactions.findIndex(
            (transaction) => transaction.transactionId === transactionIdToDelete
        );

        if (transactionIndex === -1) 
        {
            return res.status(404).json({ message: "Transaction not found" });
        }

        user.transactions.splice(transactionIndex, 1);
        await user.save();

        res.status(200).json({ message: "Transaction deleted successfully" });
        
    }
    catch(error)
    {
        console.error(error);

        if(error.name==='TokenExpiredError')
        {
            return res.status(401).json({message:"Token expired"});
        }
        else if(error.name==='JsonWebTokenError')
        {
            return res.status(401).json({message:"Invalid token"});
        }
        else
        {
            return res.status(500).json({message:"Internal Server Error"});
        }
    }
};

module.exports = {
    login,
    signup,
    authenticateJWT,
    fetchTransactions,
    uploadTransactions,
    editTransaction,
    deleteTransactcion
};
