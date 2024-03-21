const express = require('express');
const router = express.Router();
const Author = require("../models/author.js");
const slugify = require("slugify");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


router.post('/auth', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the author with the provided email
        const author = await Author.findOne({ email });

        // If author is not found, return a 404 error
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        // Compare the provided password with the stored password hash
        const isPasswordValid = password == author.password;

        // If the password is invalid, return a 401 error
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If the email and password are correct, return the author
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router ;