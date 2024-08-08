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
    userType: {
        type: String, 
        required: true,
    },
    address: {
        houseNo: {
            type: String,
            required: true,
          },
        city: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken : {
        type : String,
        default : null
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