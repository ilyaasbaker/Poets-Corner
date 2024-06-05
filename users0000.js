
//     const users=[
//         {username:'user1', password:'123', loggedin:false},
//         {username:'user2', password:'123', loggedin:false}
//     ]

//     function newUser(username, password){
//         const user={username:username, password:password, loggedin:false}
//         users.push(user)
//     }

//     function getUsers(){
//         return users
//     }

//     function findUser(username){
//         return users.find(user=>user.username==username)
//     }

//     // function checkPassword(username, password){
//     //     let user=findUser(username)
//     //     if(user){
//     //         return user.password==password
//     //     }
//     //     return false
//     // }

//     async function checkPassword(username, password, action){

//         let user = await findUser(username)
       
//         bcrypt.compare(password, user.password)
//         .then (isMatch => {

//             action(isMatch)

//         })
//         .catch (err => {

//             throw err

//         })
//     }

//     function setLoggedIn(username, state){
//         let user=findUser(username)
//         if(user){
//             user.loggedin=state
//         }
//     }

//     function isLoggedIn(username){
//         let user=findUser(username)
//         if(user){
//             return user.loggedin=state
//         }
//         return false
//     }

//     // importing bcrypt
//     const bcrypt = require('bcrypt')
//     const SALT_WORK_FACTOR = 10

//     // salt and hash when password is changed 
//     userSchema.pre('save', function(next){

//         let user = this;

//         // hash if passoword is new or modified
//         if (!user.isModified('password')) return next();

//         //generate salt 
//         brcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

//             if (err) return next(err);

//             // hash using new salt
//             bcrypt.hash(user.password. salt, function(err, hash) {

//                 if(err) return next (err); 

//                 // override reggie password with hashed password
//                 user.password = hash;
//                 next();

//             });

//         });

//     });

// exports.newUser=newUser;
// exports.getUsers=getUsers;
// exports.findUser=findUser;
// exports.checkPassword=checkPassword;
// exports.setLoggedIn=setLoggedIn;
// exports.isLoggedIn=isLoggedIn;

