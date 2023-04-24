const User=require('../models/user')
const bcrypt=require('bcrypt');

exports.adduser=async(req,res)=>{
   console.log("hello")
    const data=req.body;
   // console.log(data)
    const e=await User.findOne({
        where:{
            email:data.email
        }
    })
    console.log(e)
    if(e===null){
        
        bcrypt.hash(data.password,10,async(err,password)=>{
            User.create({
                name:data.name,
                email:data.email,
                phone:data.phone,
                password:password
               })
               .then((response)=>{
                
                    console.log('user added sucessfully')
                
                    
                   res.status(201).json({massage:response,Status:200})
                
               }).catch(err=>{
                console.log(err);
                res.sendStatus(500)
               })
               
            })
    }else{
        res.status(203).json({massage :'user already exist'})
    }
       
    }
   
