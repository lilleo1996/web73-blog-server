const { ObjectId } = require("mongodb");

const { db } = require("../utils/connectDb");

// GET posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $facet: {
          paginatedPosts: [{ $skip: skip }, { $limit: pageSize }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];
    const [result] = await db.posts.aggregate(pipeline).toArray(); 
    const { paginatedPosts, totalCount } = result;
    const totalPosts = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(totalPosts / pageSize);
    res.status(200).json({
      message: "Get post list successful",
      data: paginatedPosts,
      page,
      pageSize,
      totalPages,
      totalCount: totalPosts,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

// GET post by id
const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await db.posts.findOne({
      _id: new ObjectId(id),
    });
    res.status(200).json({
      message: "Get post detail by id successful",
      data: post,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

// CREATE new post
const createPost = async (req, res) => {
  try {
    const { title, content, author, hashtags } = req.body;
    const post = {
      title,
      content,
      author, // const author = req.user get jwt
      hashtags,
    };

    await db.posts.insertOne(post);
    res.status(201).json({
      message: "Create a post successful",
      data: post,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

// UPDATE post
const updatePost = async (req, res) => {
  const { title, content, author, hashtags } = req.body;
  try {
    const id = req.params.id;
    await db.posts.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: title,
          content: content,
          author: author,
          hashtags: hashtags,
        },
      }
    );
    res.status(200).json({
      message: "Update post by id successful",
      data: { ...req.body, id: id },
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

// DELETE post by id
const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    await db.posts.deleteOne({
      _id: new ObjectId(id),
    });
    res.status(200).json({
      message: "Delete post by id successful",
      data: { id },
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
