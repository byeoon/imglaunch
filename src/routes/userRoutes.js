const express = require("express")
const AppDataSource = require('../database')

const router = express.Router();

router.post("/users", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userRepo = AppDataSource.getRepository("User")
        const existing = await userRepo.findOneBy({ email })
        if (existing) {
            return res.status(400).json({ message : "User already exists!"})
        }

        const user = userRepo.create({username, email, password});
        const newuser = await userRepo.save(user)

        res.status(201).json({ message: "User created.", user : newuser})
        
    } catch {
        console.log(error)
        res.status(500).json({message : "internal error"})
    }
})

router.post('/users/login',async(req,res) => {
    const { username, email, password } = req.body;
    const userRepo = AppDataSource.getRepository("User")
    const user = await userRepo.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  })

module.exports = router;

