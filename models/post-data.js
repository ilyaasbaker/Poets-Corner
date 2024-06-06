const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    postedBy: String,
    imagePath: String,
    message: String,
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },  
    time: Date
});

const Post = model('Post', postSchema);

function addNewPost(userID, post, imageFilename) {
    let myPost = {
        postedBy: userID,
        imagePath: imageFilename,
        message: post.message,
        likes: 0,
        likedBy: [],
        time: Date.now()
    }
    Post.create(myPost)
        .catch(err => {
            console.log("Error: " + err)
        });
}

async function getPosts(n = 3) {
    let data = [];
    await Post.find({})
        .sort({ 'time': -1 })
        .limit(n)
        .exec()
        .then(mongoData => {
            data = mongoData
        });
    return data;
}

async function getUserPosts(username) {
    let data = [];
    await Post.find({ postedBy: username })
        .sort({ 'time': -1 })
        .exec()
        .then(mongoData => {
            data = mongoData;
        })
        .catch(err => {
            console.log("Error: " + err);
        });
    return data;
}

async function toggleLike(postId, userId) {
    let post = await Post.findById(postId);
    if (post) {
        const index = post.likedBy.indexOf(userId);
        if (index === -1) {
            // add like
            post.likedBy.push(userId);
            post.likes += 1;
        } else {
            // remove like
            post.likedBy.splice(index, 1);
            post.likes -= 1;
        }
        await post.save();
        return true;
    }
    return false;
}

module.exports = {
    addNewPost,
    getPosts,
    getUserPosts, 
    toggleLike
}
