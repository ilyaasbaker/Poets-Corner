const express = require('express');
const app = express();
app.listen(9037, () => console.log('listening at port 9037'));

// Serve unspecified static pages from our public dir
app.use(express.static('public'))
// Make express middleware for JSON available
app.use(express.json())

// Allows us to process post info in URLs
app.use(express.urlencoded({ extended: false }));

// Import necessary modules
const path = require('path');
const multer = require('multer');
const users = require('./models/users.js')
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
require('dotenv').config()
const mongoose = require('mongoose')
const postData = require('./models/post-data.js')

// Constants to hold expiry times in ms
const threeMins = 1000 * 60 * 3;
const oneHour = 1000 * 60 * 60;

// Setup cookie parser middleware
app.use(cookieParser());

// Setup sessions middleware with configuration
app.use(sessions({
    secret: "a secret that only i know",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false
}));

const mongoDBPassword = process.env.MONGODBPASSWORD
const myUniqueDatabase = "PoetsCorner"
const connectionString = `mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${myUniqueDatabase}?retryWrites=true&w=majority`
mongoose.connect(connectionString)

// Setup multer for file uploads
const upload = multer({ dest: 'public/uploads/' })

// Test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction) {
    if (request.session && request.session.userid) {
        nextAction()
    } else {
        request.session.destroy()
        return response.redirect('/login.html')
    }
}

// Controller for the main app view, depends on user logged in state
app.get('/app', checkLoggedIn, (request, response) => {
    response.redirect('./application.html')
})

// LOGOUT CONTROLLER
app.post('/logout', async (request, response) => {
    request.session.destroy()
    console.log(await users.getUsers())
    response.redirect('./login.html')
})

// LOGIN CONTROLLER
app.post('/login', async (request, response) => {
    console.log(request.body)
    let userData = request.body
    console.log(userData)

    if (await users.findUser(userData.username)) {
        console.log('user found')

        await users.checkPassword(userData.username, userData.password, async function (isMatch) {
            if (isMatch) {
                console.log('password matches')
                request.session.userid = userData.username
                response.redirect('/application.html')
            } else {
                console.log('password wrong')
                response.redirect('./login.html')
            }
        })
    }
    console.log(await users.getUsers())
})

// POST CONTROLLER
app.post('/newpost', (request, response) => {
    console.log(request.body)
    console.log(request.session.userid)
    postData.addNewPost(request.session.userid, request.body)
    response.redirect('/application.html')
})

app.get('/getposts', async (request, response) => {
    response.json({ posts: await postData.getPosts(5) })
})

// REGISTER NEW USER CONTROLLER
app.post('/register', async (request, response) => {
    console.log(request.body)
    let userData = request.body
    if (await users.findUser(userData.username)) {
        console.log('user exists')
        response.json({
            status: 'failed',
            error: 'user exists'
        })
    } else {
        await users.newUser(userData.username, userData.password)
        response.redirect('/login.html')
    }
    console.log(await users.getUsers())
})

// Endpoint for updating username
app.post('/update-username', checkLoggedIn, async (req, res) => {
    const { username } = req.body;
    const userId = req.session.userid;

    try {
        await users.updateUsername(userId, username);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint for uploading profile picture
app.post('/upload-profile-pic', checkLoggedIn, upload.single('profilePic'), async (req, res) => {
    const userId = req.session.userid;
    const profilePicUrl = `/uploads/${req.file.filename}`;

    try {
        await users.updateProfilePic(userId, profilePicUrl);
        res.json({ success: true, profilePicUrl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint for updating bio
app.post('/update-bio', checkLoggedIn, async (req, res) => {
    const { bio } = req.body;
    const userId = req.session.userid;

    try {
        await users.updateBio(userId, bio);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// Endpoint for getting user data
app.get('/get-user-data', checkLoggedIn, async (req, res) => {
    const userId = req.session.userid;

    try {
        const user = await users.findUser(userId);
        res.json({ username: user.username, bio: user.bio, profilePicUrl: user.profilePicUrl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint for liking a post
app.post('/like', checkLoggedIn, async (request, response) => {
    const { postId } = request.body;
    const userId = request.session.userid;
    const success = await postData.toggleLike(postId, userId);
    response.json({ success });
});

// getting user's posts
app.get('/get-user-posts', checkLoggedIn, async (req, res) => {
    const userId = req.session.userid;

    try {
        const posts = await postData.getUserPosts(userId);
        res.json({ posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});