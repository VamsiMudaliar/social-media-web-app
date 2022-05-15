const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

//update user
router.put('/:id',async (req,res)=>{
    const {userId} = req.body;
    
    if(userId===req.params.id || req.body.isAdmin) {
    
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);

            }catch(error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json('Account has been updated :');

        } catch(err) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You can Update only your Account');
    }
})
// delete user
router.delete('/:id',async (req,res)=>{
    const {userId} = req.body;
    
    if(userId===req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been Deleted :');

        } catch(err) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You Can Delete Only Your Account');
    }
})
// get a user 
router.get('/:id',async (req,res)=>{
    const {userId} = req.body;
    
    if(userId===req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findById(req.params.id);
            const {password,updatedAt,...other} = user._doc;
            res.status(200).json(other);

        } catch(err) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You Can Delete Only Your Account');
    }
})
// follow a user    
router.put('/:id/follow',async (req,res)=>{
    const {userId} = req.body;
    
    if(userId!==req.params.id) {

        try {
            const userToFollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!userToFollow.followers.includes(req.body.userId)) {

                await userToFollow.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                
                res.status(200).json('We Followed a User');
            } else {
                return res.status(403).json('You Already Follow This User');
            }
            const {password,updatedAt,...other} = user._doc;
            res.status(200).json(other);

        } catch(err) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You Can\'t Follow Yourself');
    }
})
// unfollow user  
router.put('/:id/unfollow',async (req,res)=>{
    const {userId} = req.body;
    
    if(userId!==req.params.id) {

        try {
            const userToFollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(userToFollow.followers.includes(req.body.userId)) {

                await userToFollow.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                
                res.status(200).json('Unfollowed a User');
            } else {
                return res.status(403).json('You Don\'t Follow This User');
            }
            const {password,updatedAt,...other} = user._doc;
            res.status(200).json(other);

        } catch(err) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You Can\'t Unfollow Yourself');
    }
})


module.exports = router;