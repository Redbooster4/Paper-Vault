const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [];
router.post('/register', async(req, res) => {
  try{
    const{ username, email, password, role } = req.body;
    if(!username || !email || !password || !role){
      return res.status(400).json({ error: 'All fields required' });
    }
    if(users.find(u => u.email === email)){
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash=await bcrypt.hash(password, 10);
    const user= { 
      id: users.length + 1, 
      username, 
      email, 
      password: hash, 
      role
    };
    users.push(user);
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

    const user=users.find(u => u.email === email);
    const pass=await bcrypt.compare(password, user.password);
    if(!user || !pass){
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
     { 
      id: user.id, 
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
        role: user.role },
    });
  } 
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
