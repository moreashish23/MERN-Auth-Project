const { createPostSchema } = require("../middlewares/validator");
const Post = require("../models/postsModel");


exports.getPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const postsPerPage = 10;

    let pageNum = page && page > 1 ? page - 1 : 0;

    const result = await Post.find()
      .sort({ createdAt: -1 })
      .skip(pageNum * postsPerPage)
      .limit(postsPerPage)
      .populate({
        path: "userId",
        select: "email",
      });

    res.status(200).json({
      success: true,
      message: "posts",
      data: result,
    });
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.singlePost = async (req, res) => {
  try {
    const { _id } = req.query;

    const existingPost = await Post.findById(_id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post unavailable",
      });
    }

    const result = await Post.findById(_id).populate({
      path: "userId",
      select: "email",
    });

    res.status(200).json({
      success: true,
      message: "single post",
      data: result,
    });
  } catch (error) {
    console.error("Single Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.createPost = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); // 🔥 DEBUG

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }

    const { title, description } = req.body;
    const userId = req.user.userId;

    console.log("BODY:", req.body);
    console.log("USER ID:", userId);

    const { error } = createPostSchema.validate({
      title,
      description,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await Post.create({
      title,
      description,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Post created",
      data: result,
    });

  } catch (error) {
    console.error("Create Post Error:", error);

    res.status(500).json({
      success: false,
      message: error.message, 
    });
  }
};


exports.updatePost = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "You can only edit or delete your own posts." });
    }

    const { _id } = req.query;
    const { title, description } = req.body;
    const userId = req.user.userId;

    const { error } = createPostSchema.validate({
      title,
      description,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existingPost = await Post.findById(_id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post unavailable",
      });
    }

    if (existingPost.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    existingPost.title = title;
    existingPost.description = description;

    const result = await existingPost.save();

    res.status(200).json({
      success: true,
      message: "Updated",
      data: result,
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "You can only edit or delete your own posts." });
    }

    const { _id } = req.query;
    const userId = req.user.userId;

    const existingPost = await Post.findById(_id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post unavailable!",
      });
    }

    if (existingPost.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    await Post.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Deleted!",
    });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};