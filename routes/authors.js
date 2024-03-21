const express = require('express')
const router = express.Router();
const Author = require('../models/author');
const slugify = require("slugify");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add One Author
router.post("/authors", async (req, res) => {
  try {
    const { name, email, image, slug } = req.body;
    if (!name || !email || !slug) {
      return res
        .status(400)
        .json({ error: "Name, email, and slug are required" });
    }
    const author = new Author({ name, email, image, slug });
    const savedAuthor = await author.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    console.error("Error adding author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get One Author by Slug
router.get("/authors/:slug", async (req, res) => {
  try {
    const author = await Author.findOne({ slug: req.params.slug });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update One Author by Slug using PATCH
router.patch("/authors/:slug", async (req, res) => {
  try {
    const { name, email, image } = req.body;
    const updatedAuthor = await Author.findOneAndUpdate(
      { slug: req.params.slug },
      { name, email, image },
      { new: true }
    );
    if (!updatedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.json(updatedAuthor);
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete One Author by Slug
router.delete("/authors/:slug", async (req, res) => {
  try {
    const deletedAuthor = await Author.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!deletedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
