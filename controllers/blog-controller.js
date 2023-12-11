import Blog from "../model/Blog.js";
import User from "../model/User.js";
import mongoose from "mongoose";

export const getAllBlogs = async (request, response, next) => {
    let blogs;

    try {
        blogs = await Blog.find();
    } catch (err) {
        return console.log(err);
    }

    if (!blogs) {
        return response.status(404).json({ message: "No Blogs found!"});
    }

    return response.status(200).json({blogs});
};

export const addBlog = async (request, response, next) => {
    const { title, description, image, user } = request.body;
    let existingUser;

    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err);
    }

    if (!existingUser) {
        return response.status(400).json({ message: "Unable to find user by this id." });
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return response.status(500).json({ message: err });
    }

    return response.status(200).json({blog});
};

export const updateBlog = async (request, response, next) => {
    const {title, description } = request.body;
    const blogId = request.params.id;
    let blog;

    try {
         blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        });
    } catch (err) {
        return console.log(err);
    }

    if (!blog) {
        return response.status(500).json({ message: "Unable to update the blog!" });
    }

    return response.status(200).json({ blog });
};

export const getById = async (request, response, next) => {
    const id = request.params.id;
    let blog;

    try {
        blog = Blog.findById(id);
    } catch (err) {
        return console.log(err);
    }

    if (!blog) {
        return response.status(404).json({ message: "No Blog Found!"});
    }

    return response.status(200).json({ blog });
};

export const deleteBlog = async (request, response, next) => {
    const id = request.params.id;
    let blog;

    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        return console.log(err);
    }

    if (!blog) {
        return response.status(400).json({ message: "Unable to delete!" });
    }

    return response.status(200).json({ message: "Successfully deleted"});
};

export const getByUserId = async (request, response, next) => {
    const userId = request.params.id;
    let userBlogs;

    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        return console.log(err);
    }

    if (!userBlogs) {
        return response.status(404).json({ message: "No blog found!"});
    }

    return response.status(200).json({ blogs:userBlogs });
}