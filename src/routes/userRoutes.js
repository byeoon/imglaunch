const express = require("express")
const AppDataSource = require('../database')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')

const http = require('http');
const url = require('url');
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
        password = hashedPassword; // This feels like unsafe shitcode.

        const user = userRepo.create({username, email, password});
        const newuser = await userRepo.save(user)
        
        const userToken = jwt.sign({ email: user.email }, 'secret');
        res.status(201).json({ message: "User created.", user : newuser, token: userToken})
    } catch(error) {
        console.log(error);
        res.status(500).json({message : "internal error"})
    }
})

router.post('/users/login',async(req,res) => {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOneBy({ email: email });

    // Could just add better handling but not now
    if (!user) {
        console.log("no exist.");
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
        console.log("not the same");
        return res.status(401).json({ error: 'Not the same password' });
    }

    const token = jwt.sign({ email: user.email }, 'secret');
    res.json({ token });
    console.log("New user signed in with token: " + token);
})

router.post('/users/accountrecovery',async(req,res) => {
    const { email } = req.body;
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOneBy({ email: email });

    // Could just add better handling but not now
    if (!user) {
        console.log("no exist.");
        return res.status(401).json({ error: 'This email has not been registered.' });
    }

    var mail = {
        from: process.env.EMAIL_NAME,
        to: email,
        subject: 'MyShare Account Recovery',
        text:'You have requested to recover your account details.'
    } 

    transporter.sendMail(mail, function(error, info) {
        if (error) {
            console.log(error);
       //     console.log(process.env.EMAIL_NAME + "\ " + process.env.EMAIL_PASSWORD)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
})

module.exports = router;

