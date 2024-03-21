const express = require('express')
const router = express.Router();
const Post = require("../models/post");
const slugify = require("slugify");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Author = require("../models/author");
const Category = require("../models/category");




router.get("/posts", async (req, res) => {
  try {
    const { title } = req.query;

    // If title is provided, search for posts with matching title
    if (title) {
      const posts = await Post.find({ title: { $regex: title, $options: "i" } })
        .populate({
          path: "author",
        })
        .populate({
          path: "category",
        });
      res.json(posts);
    } else {
      // If no title provided, return all posts
      const posts = await Post.find()
        .populate({
          path: "author",
        })
        .populate({
          path: "category",
        });
      res.json(posts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/posts/:id", async (req, res) => {
  try {
    const { title, content, imageUrl, authorId, categoryId, meta_description, meta_keywords, meta_title, slug } = req.body;

    const updateFields = {};

    // Update the fields that are provided in the request body
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (imageUrl) updateFields.imageUrl = imageUrl; 
    if (authorId) updateFields.author = new ObjectId(authorId);
    if (categoryId) updateFields.category = new ObjectId(categoryId);
    if (meta_description) updateFields.meta_description = meta_description;
    if (meta_keywords) updateFields.meta_keywords = meta_keywords;
    if (meta_title) updateFields.meta_title = meta_title;
    if (slug) updateFields.slug = slug;

    const post = await Post.findOneAndUpdate({ _id: req.params.id }, updateFields, { new: true });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get One Post by Slug
router.get("/posts/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate({
        path: "author",
      })
      .populate({
        path: "category",
      });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new Post
router.post("/posts", async (req, res) => {
  try {
    const { title, content, imageUrl, slug, authorId, categoryId } = req.body;

    // Validate if authorId and categoryId are valid ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(authorId) ||
      !mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      return res.status(400).json({ error: "Invalid authorId or categoryId" });
    }

    // Check if the author and category exist
    const author = await Author.findById(authorId);
    const category = await Category.findById(categoryId);
    if (!author || !category) {
      return res.status(404).json({ error: "Author or Category not found" });
    }

    // Create a new post document
    const post = new Post({
      title,
      content,
      imageUrl,
      slug,
      author: authorId,
      category: categoryId,
    });

    // Save the post to the database
    await post.save();

    // send email to users
    /* Please customise to preference */

    sendEmail('testing@gmail.com', 'Mail Title', '<b> Mail Content goes here </b>');
    // Send a success response with the created post
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/posts/:_id", async (req, res) => {
  try {
    const _id = req.params._id;

    // Find the post by its slug and delete it
    const deletedPost = await Post.findOneAndDelete({ _id });

    // If the post was not found, return 404
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
