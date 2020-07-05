const Post = require('../models/post')

const pagination = (query)=> {
    query.pageSize = Number(query.pageSize) || 5
    query.page = Number(query.page) || 1
    query.page = query.pageSize * (query.page-1)
    return query
}

const getPosts =  async (req,res)=> {
    try {
        const modifiedQuery = pagination(req.query)
        const posts = await Post.find().skip(modifiedQuery.page).limit(modifiedQuery.pageSize)
        const maxPosts = await Post.countDocuments()
        res.status(200).send({
            message: "Posts fetched successfully",
            posts,
            maxPosts
        })
    }
    catch(e) {
        res.status(400).send(e)
    }
}

const createPost = async (req,res)=> {
    try {
        if(!req.file)
        {
            throw ({message: 'please provide an image'})
        }
        const url = req.protocol + "://" + req.get("host")
        const post = await Post.create({
            title: req.body.title, 
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userId
        })
        res.status(201).send({
            message: "Post added successfully",
            post
        })
    }
    catch(e) {
        res.status(400).send(e)
    }
}

const getPost = async(req,res)=> {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            throw ({message: "no post found"})
        }
        res.status(200).send(post)
    }
    catch(e) {
        res.status(500).send(e)
    }
}

const updatePost = async(req,res)=> {
    try {
        let imagePath = req.body.imagePath
        if(req.file) {
            const url = req.protocol + "://" +req.get("host")
            imagePath = url + "/images/" + req.file.filename
        }
        const post = await Post.findOneAndUpdate({_id: req.params.id, creator: req.userId}, {title: req.body.title, content: req.body.content, imagePath, creator: req.userId}, {runValidators: true, new: true})
        if(!post) {
            throw({message: "no post found"})
        }
        res.status(200).send({
            message: 'Updated Successfully'
        })
    }
    catch(e) {
        res.status(500).send(e)
    }
}

const deletePost = async(req,res)=> {
    try {
        const post = await Post.findOneAndDelete({_id: req.params.id, creator: req.userId})
        if(!post)
        {
            throw({message: "no post found"})
        }
        res.status(200).send({
            message: "Post deleted successfully",
        })
    }
    catch(e) {
        res.status(500).send(e)
    }
}

module.exports = {
    getPosts,
    getPost,
    updatePost,
    createPost,
    deletePost
}