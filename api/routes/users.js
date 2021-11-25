const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/User');
const bcrypt = require('bcrypt');



//UPDATE
router.put('/:id', async(req, res) => {
   const { id } = req.params;
   if(req.body.userId === id){
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            // const{ password, ...others} = updatedUser._doc
            res.status(201).json(updatedUser);
        
        } catch (error) {
            res.status(500).json(err);
        }
   }else{
        res.status(401).json('You can update only your account');
   } 
});

//DELETE One
router.delete('/:id', async(req, res) => {
   if(req.body.userId === req.params.id){
    try {
        const user = await User.findById(req.params.id)
        try {
            await Post.deleteMany({username:user.username})
            await User.findOneAndDelete(req.params.id)
            res.status(201).json('User deleted')
        } catch (error) {
            res.status(500).json(err);
        }
    } catch (error) { }   
   }else{
        res.status(401).json('You can delete only your account');
   } 
});


//GET One
router.get("/:id", async(req, res) => {
    const { id: userId } = req.params;
    try {
        const user = await User.findOne({_id: userId })
        // const { password, ...others} = user._doc;
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(`Something Wrong, No user with id : ${userId}`);
    }
})

module.exports = router