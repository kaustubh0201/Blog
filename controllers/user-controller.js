import User from "../model/User";
import bcrypt from 'bcryptjs';
import {response} from "express";

export const getAllUser = async(request, response, next) => {
    let users;

    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }

    if (!users) {
        return response.status(404).json({ message: "No users found" });
    }

    return response.status(200).json(users);
};

export const signup = async (request, response, next) => {
    const {name, email, password } = request.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return console.log(err);
    }

    if (existingUser) {
        return response.status(400).json({message: "User already exists! Login instead"});
    }

    const hashedPassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });

    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }

    return response.status(201).json({user});
};

export const login = async (request, response, next) => {
    const { name, email, password } = request.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return console.log(err);
    }

    if (existingUser) {
        return response.status(404).json({ message: "Couldn't find the user by this email" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return response.status(400).json({ message: "Incorrect Password" });
    }

    return response.status(200).json({ message: "Login Successful!" });
};