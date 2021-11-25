require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const connectDB = require('./db/connect');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const catRoute = require('./routes/categories');
const app = express();


//Extra security
const helmet = require('helmet')
const cors = require('cors');
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use("/images", express.static(path.join(__dirname, "/images")));


// extra packages
app.set('trust proxy', 1);
app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, //15 minutes
      max: 100, //limit each IP to 100 requests per windowMs
  })
);

app.use(helmet())
app.use(cors())
app.use(xss())

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'images'); }, 
    filename: (req, file, cb) => { cb(null, req.body.name); },
});

const upload = multer({storage});

// File Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
    console.log('File was uploaded successfully...');
    res.status(201).json('File was uploaded successfully...');
});


//Local Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', catRoute);

const start = async() => {
    try {
        await connectDB(process.env.MONGODB_URL)
        const port = process.env.PORT || 3005
        app.listen(port, () => console.log(`Server running on port http://localhost:${port}`))
    } catch (error) {
        console.log(error)        
    }
}

start()