const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is invalid']
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) 
    {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async function(email, password) {
    if(!email || !password)
    {
        throw ({message: "please enter email and password"})
    }
    const user = await User.findOne({email})
    if(!user)
    {
        throw ({message: 'Invalid Email'})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
    {
        throw ({message: 'Invalid password'})
    }
    return user
}

userSchema.methods.generateToken = function() {
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
    return token
}

const User = mongoose.model('user', userSchema)

module.exports = User