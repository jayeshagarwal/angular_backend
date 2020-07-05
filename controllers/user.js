const User = require('../models/user')

exports.createUser = async(req,res)=> {
    try {
        const user = await User.create({email: req.body.email, password: req.body.password})
        res.status(201).send({
            message: 'User created!',
            user
        })
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}

exports.loginUser = async(req,res)=> {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.status(200).send({
            token,
            expiresIn: 3600,
            userId: user._id
        })
    }
    catch(e)
    {
        res.status(401).send(e)
    }
}