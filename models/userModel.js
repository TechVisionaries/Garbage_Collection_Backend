import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique : true
    },
    image: {
        type: String, 
        required: false,
        default: 'null'
    },
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: false
    },
    phoneNo: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    userType: {
        type: String, 
        required: true,
    },
    adderss: {
        type: String, 
        required: true,
    },
    city: {
        type: String, 
        required: true,
    },
    town: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    totalPayable: {
        type: String,
        default: 0,
    },
    bankAccNo: {
        type: String,
        default: 'null',
    },
    bankAccName: {
        type: String,
        default: 'null',
    },
    bankName: {
        type: String,
        default: 'null',
    },
    bankBranch: {
        type: String,
        default: 'null',
    },
    refreshToken : {
        type : String,
        default: 'null',
    },

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    if(!this.password){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User