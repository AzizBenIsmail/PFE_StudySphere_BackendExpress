const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");

exports.getBlogs = async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.getBlogById = async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.createBlog = async (request, response, next) => {
  const body = request.body;

  if (!body.likes) {
    body.likes = 0;
  }
  if (!body.comments) {
    body.comments = [];
  }
  if (!body.title) {
    return response.status(400).json({
      error: "title is required",
    });
  }

  const user = request.session.user;

  if (!user) {
    return response.status(401).json({ error: "User not authenticated" });
  }

  const blog = new Blog({
    title: body.title,
    content: body.content,
    dateCreated: body.dateCreated,
    likes: body.likes,
    comments: body.comments,
    user: user._id,
  });
  try {
    const savedBlog = await blog.save();
   await User.updateOne(
      { _id: user._id },
      { $push: { blogs: savedBlog._id } }
    );
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
};

exports.deleteBlog = async (request, response, next) => {
  const user = request.session.user;
  const blogToDelete = await Blog.findById(request.params.id);

  if (user._id.toString() != blogToDelete.user._id.toString()) {
    return response.status(401).json({ error: `Unauthorized` });
  }

  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (request, response, next) => {
  const user = request.session.user;
  const body = request.body;

  if (!body.likes) {
    body.likes = 0;
  }
  if (!body.title) {
    return response.status(400).json({
      error: "title is required",
    });
  }

  

  const blog = {
    title: body.title,
    content: body.content,
    dateCreated: body.dateCreated,
    likes: body.likes,
    comments: body.comments,
  };
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(updatedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
};

exports.addComment = async (request, response) => {
  const body = request.body;
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });

  const user = request.session.user;
  const comment = {
    content: body.content,
    user: user._id,
    dateCreated: body.dateCreated || new Date(),
  };

  blog.comments = blog.comments.concat(comment);

  const updatedBlog = await blog.save();

  updatedBlog
    ? response.status(200).json(updatedBlog.toJSON())
    : response.status(404).end();
};
