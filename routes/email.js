const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Email = require('../models/email_list'); 

// Get all emails
router.get('/emails', async (req, res) => {
  try {
    const emails = await Email.find();
   
    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new email
router.post('/emails', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const newEmail = new Email({ email });
    const savedEmail = await newEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    console.error('Error adding email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;