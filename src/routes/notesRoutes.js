const express = require("express")
const AppDataSource = require('../database');
const jwt = require('jsonwebtoken')
const router = express.Router();

const verifyToken = (req, res, next) => {  
    const token = req.headers['authorization'];
    if (!token) {
      console.log("User does not have a token.");
      return res.status(401).json({ error: 'You are not signed in.' });
    }
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          console.log("Invalid token.");
          return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        console.log("Valid token, " + decoded);
        next();
      });
  };

router.post("/notes/create", verifyToken, async (req, res) => {
    const userId = req.headers['authorization-id'];
    const file = "";
    let { title, content } = req.body;
    try {
        const noteRepo = AppDataSource.getRepository("Note");
        const note = noteRepo.create({userId, title, content, file});
        const newNote = await noteRepo.save(note)
        
      //  res.status(500).json({message : "This route is not finished yet."});
      res.status(201).json({ message: "Note made.", note : newNote})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message : "internal error"})
    }
})

router.get("/notes/delete", verifyToken, async (req, res) => {
    try {
        const noteRepo = AppDataSource.getRepository("Note");
        res.status(500).json({message : "This route is not finished yet."});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message : "internal error"})
    }
})

router.get("/notes/get", verifyToken, async (req, res) => {
    const userId = req.headers['authorization-id'];
    try {
        const noteRepo = AppDataSource.getRepository("Note");
        const [notes, count] = await noteRepo.findAndCountBy({ userId: userId });
        const formattedNotes = notes.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content
        }));

        res.status(200).json({
            userId: userId,
            count: count,
            notes: formattedNotes
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router