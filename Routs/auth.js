const router = require('express').Router();
const User = require('../Models/User');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
//register  
router.post("/register", async (req, res)=>{
const newUser = new User({
    username: req.body.username,
    email : req.body.email,
    password :  cryptojs.AES.encrypt(
        req.body.password ,
        process.env.SECRET_KEY)
        .toString(),
    profilepic: req.body.profilepic || "",
    isAdmin: req.body.isAdmin || false,

});
try{
const user = await newUser.save();
res.status(201).json(user);
}
catch(err){
    res.status(500).json(err);}
}) ;


//login 

router.post("/login", async (req, res) =>{
    
 try{
    const user = await User.findOne({email :req.body.email});
    !user && res.status(401).json('wrong password or username ');

    const bytes = cryptojs.AES.decrypt(user.password ,process.env.SECRET_KEY);
    const originalpassword = bytes.toString(cryptojs.enc.Utf8);

    originalpassword !== req.body.password && 
    res.status(401).json('wrong password or username ');

const accessToken =jwt.sign({id: user._id, isAdmin: user.isAdmin},
    process.env.SECRET_KEY,
    {expiresIn: "5d"}
    );

    const {password, ...info} = user._doc;

        res.status(200).json({...info, accessToken});
        
}
 catch(err){
res.status(500).json(err); 
}
     
})


module.exports =router;