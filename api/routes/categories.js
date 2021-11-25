const router = require('express').Router();
const Category = require('../models/Category');


router.post('/', async(req, res) => {
    const newCat = new Category(req.body);
    try {
        const savedCat = await newCat.save();
        res.status(201).json({ savedCat })
    } catch (error) {
         res.status(500).json('Something wrong, We could not find your posts');
    }
}); 


router.get('/', async(req, res) => {
    const catName = req.body;
    try {
        const cats = await Category.find({})
        res.status(200).json({ cats })
    } catch (error) {
         res.status(500).json( `Something wrong, no category found` );
    }
});


module.exports = router