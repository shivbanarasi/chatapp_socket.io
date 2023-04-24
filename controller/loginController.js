const User=require('../models/user');
const bcrypt=require('bcrypt')
const path=require('path');
const jwt=require('jsonwebtoken');
require('dotenv').config()



function generateExessToken(id){
  return jwt.sign({userId:id},'totototo')
}

exports.loginuser=(req,res)=>{
    const {email,password}=req.body;
    //console.log(password,email)
     User.findAll({
      where:{
         email:email 
    }
  }).then((loginuser)=>{
    //console.log(loginuser[0].email);
     if(loginuser[0].email===email){
       console.log(loginuser[0].password)
       bcrypt.compare(password, loginuser[0].password, function(err, result) {
         
         if(result==true){
           console.log('password matched') 
res.status(201).json({massage:'user logged in successfully',token:generateExessToken(loginuser[0].id)})
              
}else{
console.log('password does not match')
res.status(404).json({massage:'password not mathed'})
}
})     
    }else{
      res.status(401).json({
        massage:'user not found'
      })
    }}
    )
    .catch((err)=>{
      res.sendStatus(404)
    })

     
       
          }
         
        
      
      

