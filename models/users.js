const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    username: String,
    password: String,
    loggedin: Boolean,
    profilePicUrl: String,
    bio: String 
});

async function updateUsername(currentUsername, newUsername) {
    await User.findOneAndUpdate({ username: currentUsername }, { username: newUsername }).exec();
}

async function updateProfilePic(username, profilePicUrl) {
    await User.findOneAndUpdate({ username }, { profilePicUrl }).exec();
}

async function updateBio(username, bio) {
    await User.findOneAndUpdate({ username }, { bio }).exec();
}

userSchema.pre('save', function(next) {
    let user = this;

    // hash password if new or changed
    if (!user.isModified('password')) return next();

    // gen salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash password with new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override reg password with hashed one
            user.password = hash;
            next();
        }); 
    });
});

const User = model('User', userSchema);

async function newUser(username, password) {
    const user = { username: username, password: password, loggedin: false };
    await User.create(user).catch(err => {
        console.log('Error:' + err);
    });
}

async function getUsers() {
    let users = [];
    await User.find({}).exec()
        .then(dataFromMongo => {
            users = dataFromMongo;
        })
        .catch(err => {
            console.log('Error:' + err);
        });
    return users;
}

async function findUser(userToFind) {
    let foundUser = null;
    await User.findOne({ username: userToFind }).exec()
        .then(mongoData => {
            foundUser = mongoData;
        })
        .catch(err => {
            console.log('Error:' + err);
        });
    return foundUser;
}

async function checkPassword(username, password, action) {
    let user = await findUser(username);
    bcrypt.compare(password, user.password)
        .then(isMatch => {
            action(isMatch);
        })
        .catch(err => {
            throw err;
        });
}

exports.newUser = newUser;
exports.getUsers = getUsers;
exports.findUser = findUser;
exports.checkPassword = checkPassword;
exports.updateUsername = updateUsername;
exports.updateProfilePic = updateProfilePic;
exports.updateBio = updateBio;
