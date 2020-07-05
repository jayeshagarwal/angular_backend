const jwt = require('jsonwebtoken')
const User =  require('../models/user')

module.exports = async (req,res,next)=> {
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            const token = req.headers.authorization.replace('Bearer ', '')
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded._id)
            if(!user)
            {
                new Error({message: 'no user found'})
            }
            req.userId = user._id
            next()
        }
        else 
        {
            throw ({message: 'Authentication is required'})
        }
    }
    catch(e)
    {
        res.status(401).send(e)
    }
}