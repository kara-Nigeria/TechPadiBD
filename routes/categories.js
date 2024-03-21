const express = require('express');
const router = express.Router();
const Category = require("../models/category.js");
const slugify = require("slugify");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post("/categories", async (req, res) => {
  try {
    const { name, description, slug, image } = req.body;

    // Check if the slug is already in use
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this slug already exists" });
    }

    // Create a new category instance
    const newCategory = new Category({
      name,
      description,
      slug,
      image,
    });

    // Save the new category to the database
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/categories/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/categories/:slug", async (req, res) => {
  try {
    const { name, description, slug: newSlug, image } = req.body;
    const filter = { slug: req.params.slug };
    const update = {};

    if (name) {
      update.name = name;
    }

    if (description) {
      update.description = description;
    }

    if (newSlug) {
      update.slug = newSlug;
    }

    if (image) {
      update.image = image;
    }

    const updatedCategory = await Category.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/categories/:slug", async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
