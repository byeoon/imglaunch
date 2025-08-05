const express = require("express")
const AppDataSource = require('../database')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')

const router = express.Router();

var transporter = nodemailer.createTransport({
    service: "zoho",
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD
   }
  });

router.post("/users", async (req, res) => {
    let { username, email, password } = req.body;
    try {
        const userRepo = AppDataSource.getRepository("User")
        const existing = await userRepo.findOneBy({ email })
        if (existing) {
            return res.status(400).json({ message : "User already exists!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword; // This feels insecure.

        const user = userRepo.create({username, email, password});
        const newuser = await userRepo.save(user)
        
        const userToken = jwt.sign({ email: user.email }, 'secret');
        res.status(201).json({ message: "User created.", user : newuser, token: userToken})
    } catch(error) {
        console.log(error);
        res.status(500).json({message : "internal error"})
    }
})

router.post('/users/login', async(req,res) => {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOneBy({ email: email });

    // Could just add better handling but not now
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password!' });
    }

    const token = jwt.sign({ email: user.email }, 'secret');
    res.json({ token });
})

module.exports = router;

