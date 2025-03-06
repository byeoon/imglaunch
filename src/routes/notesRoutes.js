const express = require("express")
const AppDataSource = require('../database')

const router = express.Router();

router.get("/notes/create", async (req, res) => {
    try {
        const noteRepo = AppDataSource.getRepository("Note");
        res.status(500).json({message : "This route is not finished yet."});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message : "internal error"})
    }
})

router.get("/notes/delete", async (req, res) => {
    try {
        const noteRepo = AppDataSource.getRepository("Note");
        res.status(500).json({message : "This route is not finished yet."});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message : "internal error"})
    }
})

module.exports = router