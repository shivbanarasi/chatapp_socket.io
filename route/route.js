const express=require('express');
const route=express.Router();
const authorization=require('../middleware/auth')
const signupController=require('../controller/signup')
const logincontroller=require('../controller/loginController')
const contentController=require('../controller/contentController')

route.post("/",signupController.adduser);

route.post('/views/login.html',logincontroller.loginuser)

route.post('/views/display.html',authorization.authenticate,contentController.addMassage)

route.post('/views/group',authorization.authenticate,contentController.addgroup)

route.get('/views/grouplist',authorization.authenticate,contentController.list)

route.post('/views/addgroupuser',authorization.authenticate,contentController.addgroupuser)

route.get('/views/showusers',contentController.showusers)

route.get("/views/getgroupdata",authorization.authenticate,contentController.getgroupdata)

route.get('/views/getdata',authorization.authenticate,contentController.getdata)

module.exports=route;