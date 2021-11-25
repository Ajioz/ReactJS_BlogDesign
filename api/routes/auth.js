const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')


//REGISTER
router.post('/register', async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword })
        const user = await newUser.save()
        res.status(200).json('User created successfully')
    } catch (error) {
        res.status(500).json('You are required to fill in the details');
    }
});


//LOGIN
router.post('/login', async(req, res)=>{
    // const { username, password } = req.body;
    try {
        const user = await User.findOne({username:req.body.username});
        if(!user) return res.status(400).json('Wrong user credentials!');

        const validated = await bcrypt.compare(req.body.password, user.password);
        if(!validated) return res.status(400).json('Wrong user credentials!');

        // const {password, ...others } =  user._doc;
        return res.status(200).json(user);

    } catch (error) {
        res.status(500).json(err)
    }
})


module.exports = router