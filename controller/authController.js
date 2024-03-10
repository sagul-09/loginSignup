import authModel from "../model/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const signUp = async(req, res) => {
    try{
        if(!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingUser = await authModel.findOne({name: req.body.name});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const existingMail = await authModel.findOne({email: req.body.email});
        if(existingMail){
            return res.status(400).json({message: "Email already exists"});
        }
        const user = await authModel.create(req.body);
        return res.status(201).json({message: "User created",user});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const login = async (req, res) => {
    try{
        if(!req.body.email || !req.body.password){
            return res.status(400).json({message: "All fields are required"});
        }
        const emailNotExist = await authModel.findOne({email: req.body.email});
        if(!emailNotExist){
            return res.status(400).json({message: "Email does not exist"});
        }
        const isActive = await authModel.findOne({email: req.body.email}).select("active");
        if(!isActive){
            return res.status(400).json({message: "User is not active"});
        }      
        const getPassword = await authModel.findOne({email: req.body.email}).select("password");
        const comparePassword = bcrypt.compare(req.body.password, getPassword.password);
        if(!comparePassword){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const userId = await authModel.findOne({ email: req.body.email }).select("_id");
        const userEmail = await authModel.findOne({ email: req.body.email }).select("email");
        const token = jwt.sign({id: userId._id, email:userEmail.email}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        return res.status(200).json({message: "Logged in", token});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {signUp, login};
