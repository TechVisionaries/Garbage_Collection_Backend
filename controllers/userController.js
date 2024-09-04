import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import {generateAccessToken, generateRefreshToken} from '../utils/generateToken.js';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import { sendMail } from '../utils/mailer.js'
// import { sendSMS } from '../utils/smsSender.js';


// @desc    Register a new user
// route    POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, phoneNo, userType, houseNo, city, street, password, confirmPassword } = req.body;
    const address = {
        houseNo,
        city,
        street,
    };

    const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNo,
        userType,
        address,
        password
    });

    if(password == confirmPassword){
        await newUser.save()
        .then(() => {
            res.status(201).send({ status: "User Added Successfully", user: newUser });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "You already have a account" });
        });
    }else{
        res.status(412).send({ status: "Password miss match" });
    }
    
});


// @desc    Auth user & set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body;
      await User.findOne({ email })
        .then((loguser) => {
            if (!loguser) {
                return res.status(404).send({ status: "User not found" });
            }
            const comparedpassword = bcrypt.compare(password, loguser.password)
            if (comparedpassword) {
                const userlogtype = loguser.userType;
                const userId = loguser._id;
                const loggertype = { useremail: email, userType: userlogtype };
                const accessToken = generateAccessToken(loggertype);
                const refreshToken = generateRefreshToken(loggertype);
                loguser.refreshToken = refreshToken;
                loguser.save();
                res.status(200).send({ status: "User logged Successfully", accessToken, refreshToken, userId, userlogtype });
            } else {
                res.status(412).send({ status: "User password is incorrect" });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "Error with logging functionality" });
        });
 });



// @desc    Logout user
// route    POST /api/users/logout
// @access  Public
 const logoutUser = asyncHandler(async (req, res) => {

    const { email } = req.body;

    await User.findOneAndUpdate({ email }, { $set: { refreshToken: null } })
        .then(() => {
            res.cookie('jwt', '', {
                httpOnly:true,
                expires: new Date(0)
           });
           res.status(200).send({ status: "Logged out successfully" });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "Error with logout functionality" });
        });   
 });


// @desc    Get user profile
// route    GET /api/users/profile/:id

// @access  Private
 const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        res.status(200).send({ status: "User fetched", user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with fetching one user data" });
    }
 });


// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
 const updateUserProfile = asyncHandler(async (req, res) => {
     const user = await User.findOne({ email: req.body.email});

     if(user){
         user.image = req.body.image;
         user.firstName = req.body.firstName || user.firstName;
         user.lastName = req.body.lastName || user.lastName;
         user.phoneNo = req.body.phoneNo || user.phoneNo;

         if (req.body.address) {
            user.address.houseNo = req.body.address.houseNo || user.address.houseNo;
            user.address.city = req.body.address.city || user.address.city;
            user.address.street = req.body.address.street || user.address.street;
        }
        
         user.password = req.body.password || user.password;

         const updatedUser = await user.save();

         res.status(200).json({
             _id: updatedUser._id,
             email: updatedUser.email, 
             image: updatedUser.image, 
             firstName: updatedUser.firstName, 
             lastName: updatedUser.lastName,
             userType: updatedUser.userType,
             phoneNo: updatedUser.phoneNo,
             address: updatedUser.address,
             createdAt: updatedUser.createdAt,
             updatedAt: updatedUser.updatedAt
         });
     }else{
         res.status(404);
         throw new Error('User not found');
     }
 });


// @desc    Get All User Details
// route    get /api/users/all-users
// @access  admin
const getAllUsers = asyncHandler(async (req, res) => {
    await User.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "Error with getting data" });
        });
});


// @desc    Remove user profile
// route    delete /api/users/:id
// @access  admin
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        await User.findByIdAndDelete(userId)

        res.status(200).send({ status: "User removed" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with deleting data" });
    }
});


// @desc    Auth user & set token
// route    POST /api/users/googleAuth
// @access  Public
// const googleAuthUser = asyncHandler(async (req, res) => {
//     const profile = req.body;

//     let user = await User.findOne({ email: profile.email, userType: profile.userType });

//     if(user){
//         if(user.accType == 'normal'){
//             res.status(400);
//             throw new Error('User Already Exists! Please login using your password');
//         }
//         generateToken(res, user.email);
//         res.status(200).json({
//             _id: user._id,
//             email: user.email,  
//             image: user.image, 
//             firstName: user.firstName, 
//             lastName: user.lastName, 
//             userType: user.userType,
//             phoneNo: user.phoneNo,
//             gender: user.gender,
//             accType: user.accType,
//             totalPayable: user.totalPayable,
//             bankAccNo: user.bankAccNo,
//             bankAccName: user.bankAccName,
//             bankName: user.bankName,
//             bankBranch: user.bankBranch,
//             createdAt: user.createdAt,
//             updatedAt: user.updatedAt
//         });
//     }
//     else{
//         if(profile.userType == 'occupant'){
//             user = await User.create({
//                 email: profile.email,  
//                 image: profile.image, 
//                 firstName: profile.firstName, 
//                 lastName: profile.lastName, 
//                 userType: profile.userType,
//                 phoneNo: profile.phoneNo,
//                 gender: profile.gender,
//                 accType: 'google',
//                 totalPayable: '0'
//             })
//         }
//         else{
//             user = await User.create({
//                 email: profile.email,  
//                 image: profile.image, 
//                 firstName: profile.firstName, 
//                 lastName: profile.lastName, 
//                 userType: profile.userType,
//                 phoneNo: profile.phoneNo,
//                 gender: profile.gender,
//                 accType: 'google'
//             })
//         }
        
//         if(user){
//             generateToken(res, user.email);
//             res.status(200).json({
//                 _id: user._id,
//                 email: user.email,  
//                 image: user.image, 
//                 firstName: user.firstName, 
//                 lastName: user.lastName, 
//                 userType: user.userType,
//                 phoneNo: user.phoneNo,
//                 gender: user.gender,
//                 accType: user.accType,
//                 totalPayable: user.totalPayable,
//                 bankAccNo: user.bankAccNo,
//                 bankAccName: user.bankAccName,
//                 bankName: user.bankName,
//                 bankBranch: user.bankBranch,
//                 createdAt: user.createdAt,
//                 updatedAt: user.updatedAt
//             });
//         }
//         else{
//             res.status(400);
//             throw new Error('Oops, somthing went wrong!');
//         }
//     }
    
// });



// @desc    Check if user exists and send registeration mail
// route    POST /api/users
// @access  Public


// const sendRegisterMail = asyncHandler(async (req, res) => {
//     const {
//         email, 
//         image, 
//         firstName, 
//         lastName, 
//         password,
//         userType,
//         gender 
//     } = req.body;

//     var userExists = await User.findOne({ email, userType });

//     if(userExists){
//         res.status(400);
//         throw new Error('User Already Exists');
//     }

//     const user = ({
//         email, 
//         image, 
//         firstName, 
//         lastName, 
//         password,
//         userType,
//         gender 
//     });

//     var token = jwt.sign({ user }, process.env.JWT_SECRET, { 
//         expiresIn: '1d' 
//     });

//     token = `${token.split('.')[0]}/${token.split('.')[1]}/${token.split('.')[2]}`;

//     if(token){
//         const message = `<p><b>Hello ${user.firstName},</b><br><br> 
//                             Welcome to CampusBodima! Start setting up your account by verifying your email address. Click this secure link:<br><br>
//                             <a href="http://${process.env.DOMAIN}/register/${token}">Verify your email</a><br><br>
//                             Thank you for choosing CampusBodima!<br><br>
//                             Best wishes,<br>
//                             The CampusBodima Team</p>`
        
//         sendMail(email,message,"Activate Your Account");
//         res.status(201).json({ message: "Email Verification Sent!"});
//     }
//     else{
//         res.status(400);
//         throw new Error('Email not found');
//     }

    

// });



// @desc    Generate OTP
// route    POST /api/users/generateOTP
// @access  Public
//  const generateOTP = asyncHandler(async (req, res) => {
//      const { email, userType } = req.body;

//      const user = await User.findOne({ email, accType:"normal", userType });
//      if(user){
//          req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        
//          const message = `<p>Hello ${user.firstName},<br> Your OTP is: <b>${req.app.locals.OTP}</b></p>`

//          sendMail(email, message,"Your OTP");
//          res.status(201).json({ message: "OTP Sent"});
//      }
//      else{
//          res.status(400);
//          throw new Error('Email not found');
//      }

//  });


// @desc    Verify OTP
// route    POST /api/users/verifyOTP
// @access  Public
//  const verifyOTP = asyncHandler(async (req, res) => {
//      const { otp } = req.body;
//      if(parseInt(req.app.locals.OTP) === parseInt(otp)){
        
//          res.status(201).json({ code: req.app.locals.OTP })
//      }
//      else{
//          req.app.locals.OTP = null;
//          res.status(400);
//          throw new Error("Invalid OTP");
//      }

//  });


// @desc    Generate SMS OTP
// route    POST /api/users/sms/generateOTP
// @access  public
//  const generateSMSOTP = asyncHandler(async (req, res) => {
//      const { _id, phoneNo } = req.body;

//      const user = await User.findOne({ _id });

//      req.app.locals.SMSOTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    
//      const message = `Hello ${user.firstName}, Your OTP is: ${req.app.locals.SMSOTP}. Lets verify your phone number!`
//      var number = {mobile: parseInt(phoneNo)};
//      sendSMS(number, message);
//      res.status(201).json({ message: "OTP Sent"});

//  });


// @desc    Verify OTP
// route    POST /api/users/sms/verifyOTP
//@access   public
// const verifySMSOTP = asyncHandler(async (req, res) => {
//     const { _id, otp, phoneNo } = req.body;
//     if(parseInt(req.app.locals.SMSOTP) === parseInt(otp)){
        
//         const user = await User.findOne({ _id });

//         user.phoneNo = phoneNo;

//         const updatedUser = await user.save();

//         res.status(201).json({ 
//             _id: updatedUser._id,
//             email: updatedUser.email, 
//             image: updatedUser.image, 
//             firstName: updatedUser.firstName, 
//             lastName: updatedUser.lastName, 
//             accType: updatedUser.accType, 
//             userType: updatedUser.userType,
//             phoneNo: updatedUser.phoneNo,
//             gender: updatedUser.gender,
//             totalPayable: updatedUser.totalPayable,
//             bankAccNo: updatedUser.bankAccNo,
//             bankAccName: updatedUser.bankAccName,
//             bankName: updatedUser.bankName,
//             bankBranch: updatedUser.bankBranch,
//             createdAt: updatedUser.createdAt,
//             updatedAt: updatedUser.updatedAt
//         })
//     }
//     else{
//         req.app.locals.SMSOTP = null;
//         res.status(400);
//         throw new Error("Invalid OTP");
//     }

// });


// @desc    Reset Password
// route    POST /api/users/resetPassword
// @access  Public
// const resetPassword = asyncHandler(async (req, res) => {
//     const { email, userType, newPassword } = req.body;

//     const user = await User.findOne({ email: email, userType: userType });

//     if(user){
//         user.password = newPassword;
//         const updatedUser = await user.save();

//         res.status(201).json({ message: "Password Reset Successful!"});
//     }
//     else{
//         res.status(400);
//         throw new Error('Opps...Something went wrong!');
//     }

    

// });



 export { 
     authUser,
     registerUser, 
     logoutUser,
     getUserProfile,
     updateUserProfile,
     getAllUsers,
     deleteUser
 };