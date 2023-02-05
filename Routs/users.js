const router = require('express').Router();
const User = require('../Models/User');
const cryptojs= require("crypto-js");
const verify = require('../verifyToken');


// //create
// router.post("/", verify, async (req, res) => {
//   if (req.user.isAdmin) {
//       const newUser = new User(req.body);

//       try {

//           const savedUser = await newUser.save();
//           res.status(200).json(savedUser);


//       } catch (err) {
//           res.status(500).json(err);
//       }


//   } else {
//       res.status(403).json("there is an error please try again");
//   }
// })

//update
router.put("/:id",verify, async(req, res) =>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = cryptojs.AES.decrypt(
                user.password
                 ,process.env.SECRET_KEY).toString();
            }
            try{ 
                const updateduser =  await User.findByIdAndUpdate(req.params.id,
                     {$set:req.body},
                     {new:true})
                     res.status(200).json(updateduser);

            }
            catch(err){
                res.status(500).json(err);

            }
}
else{
    res.status(403).json("you can update only your account");
}
})


//delete
router.delete("/:id",verify, async(req, res) =>{
    if(req.user.id === req.params.id || req.user.isAdmin){
       
            try{ 
                await User.findByIdAndDelete(
                    req.params.id
                     );
                     res.status(200).json('User has been deleted');

            }
            catch(err){
                res.status(500).json(err);

            }
}
else{
    res.status(403).json("you can update only your account");
}
})

//get
router.get("/find/:id", async(req, res) =>{
    
       
            try{ 
              const user =  await User.findById( req.params.id);
             const {password, ...info} = user._doc;
                     res.status(200).json(info);

            }
            catch(err){
                res.status(500).json(err);

            }

})



//get all users
router.get("/",verify, async(req, res) =>{
    const query = req.query.new;
    if(req.user.isAdmin){
       
            try{ 
                const users = query 
                ? await User.find().sort({_id:-1}).limit(5) 
                : await User.find();
                    res.status(200).json(users);   

            }
            catch(err){
                res.status(500).json(err);

            }
}
else{
    res.status(403).json("you are not allowed to see all users ");
}
})



//get user states
router.get("/stats", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;