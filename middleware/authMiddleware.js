import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                // Attempt to verify the token and log the decoded result
                try {
                    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                    const email = decoded.useremail;
                    const user = await User.findOne({ email });
                    req.user = user;
                    next();
                } catch (verificationError) {
                    res.status(400).send({ status: verificationError });
                }
            } else {
                res.status(400).send({ status: "Token is empty" });
            }
        } catch (error) {
            res.status(400).send({ status: error });
        }
    } else {
        res.status(400).send({ status: "There is no token attached to header" });
    }
});


// check wether the user is a admin
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.userType !== "Admin") {
        res.status(405).send({status: "you are not an admin"});
    } else {
      next();
    }
  });


// check wether the user is a facluty member
const isDriver = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.userType !== "Driver") {
        res.status(405).send({status: "you are not a Driver"});
    } else {
      next();
    }
  });


// check wether the user is a student
const isResident = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.userType !== "Resident") {
        res.status(405).send({status: "you are not a Resident"});
    } else {
      next();
    }
  });


  //expotation
export {
    authMiddleware, 
    isAdmin, 
    isDriver, 
    isResident
};

