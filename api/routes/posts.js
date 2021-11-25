const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');


//CREATE Post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(201).json({ savedPost });
    }catch (error) {
        res.status(500).json('Something wrong, Your post was not created');
    }
});


//UPDATE POST
router.put('/:id', async(req, res) => {
    const { params:{id: postId}, body:{username, name} } = req
    try {
        const post = await Post.findById({_id: postId});
        const item = post.categories[0];
        if(post.username === username){
            try {

                const updatedPost = await Post.findByIdAndUpdate(postId, {
                    $set: req.body
                },{new:true})

                await Post.updateOne({_id: postId, categories: item }, {$set: {"categories.$": name.trim()}})
                return res.status(201).json({ updatedPost } )

            } catch (error) {
                res.status(500).json('Something wrong with the username');
            }
        }else{
            return res.status(201).json('You can update only your post!')
        }  
    }catch (error) {
        res.status(500).json(`Something wrong, no post with such id: ${postId}`);
    }
});


//DELETE Post
router.delete('/:id', async(req, res) => {
     const {params:{id: postId}, body:{username} } = req
     try {
        const post = await Post.findById({_id: postId});
        if(post.username === username){
            try {
                await post.delete()
                return res.status(201).json('Post has been deleted..');
            } catch (error) {
                res.status(500).json('Something wrong with the username');
            }
        }else{
            return res.status(201).json('You can delete only your post!')
        }  
    } catch (error) {
        res.status(500).json(`Something wrong, no post with id: ${postId}`);
    }
});


//GET One Posts
router.get("/:id", async(req, res) => {
    const { id: postId } = req.params;
    try {
        const post = await Post.findById({_id:postId});
        return res.status(200).json({ post })
    }catch (error) {
        return res.status(500).json(`Something wrong, no post with id: ${postId}`);
    }
})


//GET All Posts
router.get("/", async(req, res) => {
    const { user, cat } = req.query;
    try {
        let posts;
        if(user){ posts = await Post.find({username: user}) }
        else if(cat) {  posts = await Post.find({categories: {$in:[cat]}}) }
        else { posts = await Post.find({}).sort('createdAt') }
        return res.status(200).json({ posts })
    }catch (error) {
         res.status(500).json('Something wrong, We could not find your posts');
    }
})

module.exports = router