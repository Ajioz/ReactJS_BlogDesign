const mongoose = require('mongoose');  

const options = {
    autoIndex: false,               // Don't build indexes
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true
};

const connectDB = (url) => {
    return mongoose.connect(url, options)
};

module.exports = connectDB;