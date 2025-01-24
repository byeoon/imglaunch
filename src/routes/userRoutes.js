const express = require("express")
const AppDataSource = require('../database')

const router = express.Router();

router.post("/users", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userRepo = AppDataSource.getRepository("User")
        const existing = await userRepo.findOneBy({ email })

        if (existing) {
            return res.status(400).json({ message : "User exists"})
        }

        const user = userRepo.create({username, email, password});
        const newuser = await userRepo.save(user)

        res.status(201).json({ message: "created", user : newuser})
        
    } catch {
        console.log(error)
        res.status(500).json({message : "internal error"})
    }
})

module.exports = router;

