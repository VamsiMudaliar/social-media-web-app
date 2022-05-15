const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
// REGISTER 
router.post('/register',async (req,res)=>{
    const {username,email,password} = req.body;
    try {
        //generate salt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = new User({
            username,email,
            password:hashedPassword
        });
        //save user return response
        const userData = await user.save();
        res.status(200).json(userData);
    }
    catch(err) {
        res.status(500).json(err);
    }
 
})
// LOGIN 
router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try {
        const fetchedUser = await User.findOne({email});
        console.log('FETCHED USER ::'+fetchedUser);

        !fetchedUser && res.status(404).json("User Not Found");

        const validPassword = await bcrypt.compare(password,fetchedUser.password);
        !validPassword && res.status(400).json('Wrong Password');

        res.status(200).json(fetchedUser);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;