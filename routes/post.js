const router = require('express').Router();
const Post = require('../models/Post');

// create a post 
router.post('/',async(req,res)=>{
    const newPost = new Post(req.body);
    try {  
        const savedPost =await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

// update a post 
router.put('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json("The Post Has Been Updated");

        } else {
            res.status(403).json('You can Update Only Your Posts');
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
})
// delete a post 
router.delete('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The Post Has Been Deleted");

        } else {
            res.status(403).json('You can Delete Only Your Post');
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
})
// get all posts 

// get single post 
router.get('/:id',async(req,res)=>{
    try {
        const fetchedPost = await Post.findById(req.params.id);
        res.status(200).json(fetchedPost);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

// like and dislike a post 
router.put('/:id/like',async(req,res)=>{
    try {
        
        const post = await Post.findById(req.params.id);
        
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json('Post was liked');
        } else {
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json('Post was Disliked');
        }
        res.status(200).json("The Post Has Been Deleted"); 
    }
    catch(err) {
        res.status(500).json(err);
    }
})

// get timeline post
router.put('/timeline/all',async(req,res)=>{

    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId=>{
                Post.find({userId:friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    }
    catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;