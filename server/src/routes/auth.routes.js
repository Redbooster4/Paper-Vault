const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getCollection } = require('../config/database');
const router = express.Router();

router.post('/register', async(req, res) => {
  try{
    const{ username, email, password, role, walletAddress } = req.body;
    if(!username || !email || !password || !role){
      return res.status(400).json({ error: 'All fields required' });
    }
    const usersCollection = getCollection('users');
    const existingUser = await usersCollection.findOne({ email });
    if(existingUser){
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash=await bcrypt.hash(password, 10);
    const user = { 
      username, 
      email, 
      password: hash, 
      role,
      walletAddress: walletAddress||null
    };
    await usersCollection.insertOne(user);
    res.json({ success: true, message: 'Registered successfully' });
  } 
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async(req, res) => {
  try{
    const{ email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ error: 'Email and password required' });
    }

    const usersCollection = getCollection('users');
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
     { 
      id: user._id.toString(), 
      email: user.email, 
      username: user.username, 
      role: user.role 
    },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user:{ 
        email: user.email, 
        username: user.username, 
        role: user.role,
        walletAddress: user.walletAddress
      },
    });
  } 
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try{
    const usersCollection = getCollection('users');
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } 
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth.middleware');

router.put('/wallet', authMiddleware, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }
    
    const usersCollection = getCollection('users');
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { walletAddress } }
    );
    
    res.json({ success: true, message: 'Wallet address updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
