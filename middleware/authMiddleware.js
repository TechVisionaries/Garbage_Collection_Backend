import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('bearer') ){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const email = decoded.useremail;
                const user = await Users.findOne({email});
                req.user = user;
                next();
            }else{
                res.status(400).send({status: "Token is empty"});
            }
        }catch(error){
            res.status(400).send({status: error});
        }
    }else{
        res.status(400).send({status: "There is no token attached to header"});
    }
})


// check wether the user is a admin
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await Users.findOne({ email });
    if (adminUser.userType !== "Admin") {
        res.status(405).send({status: "you are not an admin"});
    } else {
      next();
    }
  });


// check wether the user is a facluty member
const isFaculty = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await Users.findOne({ email });
    if (adminUser.userType !== "Faculty") {
        res.status(405).send({status: "you are not an Faculty member"});
    } else {
      next();
    }
  });


// check wether the user is a student
const isStudent = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await Users.findOne({ email });
    if (adminUser.userType !== "student") {
        res.status(405).send({status: "you are not an student"});
    } else {
      next();
    }
  });


  //expotation
  module.exports = {
    authMiddleware, 
    isAdmin, 
    isFaculty, 
    isStudent
};

