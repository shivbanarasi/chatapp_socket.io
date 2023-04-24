const { response } = require('express');
const Massage=require('../models/chatMassage');
const User=require('../models/user')
const Group=require("../models/group");
const { json } = require('body-parser');

exports.addMassage=async(req,res)=>{
    const userId=req.user.id;
    const data=req.body;
    console.log(data.groupId)
    const name=await User.findAll({
        where:{
            id:userId
        }
    })
    Massage.create({
        massage:data.massage,
        userId:userId,
        name:name[0].name,
        groupId:data.groupId
    })
    res.status(201).json({data})
}

exports.getdata=async(req,res)=>{
    const userId=req.user.id
    const name=await User.findAll({
        where:{
            id:userId
        }
    })
    
        res.status(200).json({name:name[0].name,id:userId}) 
}

exports.addgroup=async(req,res)=>{
    const userId=req.user.id;
    const data=req.body;
    console.log(`${userId+data.name}`)
    const user=await User.findAll();
    console.log(user)
    Group.create({
        name:data.name,
        groupId:`${userId+data.name}`,
        admin:userId,
        Members:userId
    }).then(resp=>{
        
                res.status(201).json({massage:"group created succcessfully",resp})
            }
        )
       
    }


exports.list=(req,res)=>{
  const id=req.user.id;  
 Group.findAll()
 .then(resp=>{
    User.findAll().then(
        response=>{
            console.log(response)
            res.status(201).json({resp,response,id:id})
        }
    )
 })
}

exports.addgroupuser=(req,res)=>{
    const data=req.body;
    const userId=req.user.id;
    Group.create({
        groupId:data.groupId,
        Members:data.id
}).then(resp=>{
    res.status(201).json({resp})
})
}

exports.showusers=(req,res)=>{
    User.findAll()
    .then(response=>{
        res.status(201).json({response})
    })
}

exports.getgroupdata=(req,res)=>{
    const id=req.user.id;
    Group.findAll()
    .then(response=>{
        res.status(200).json({response,id:id})
    })
}