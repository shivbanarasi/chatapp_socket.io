const express=require('express');
const path=require('path')
const sequelize=require('./util/database')
require('dotenv').config();
const User=require('./models/user')
const Massage=require('./models/chatMassage')
const route=require('./route/route')
const bodyParser=require('body-parser');
const Group = require('./models/group');
//const { Socket } = require('socket.io-client');
const app=express();
const http=require('http').Server(app)
const io=require('socket.io')(http)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use("/views",express.static(path.join(__dirname,"./",'views')))
console.log(path.join(__dirname,"./",'views'))

app.use(route)

User.hasMany(Massage);
Massage.belongsTo(User)

sequelize.sync(
    //{force:true}
    );

    io.on("connection",socket=>{
        console.log(socket.id);

        socket.on("send",(data,room)=>{
            //console.log(id)
           Massage.create({
            massage:data.massage,
            groupId:data.groupId,
            userId:data.id,
            name:data.name
           })
           //socket.emit("receive",`${data.name} : ${data.massage}`)
           Group.findAll({
            where:{
                groupId:data.groupId
            }
           })
           .then(response=>{
            io.emit("instent",{massage:`${data.name} : ${data.massage}`,response})
           }) 
           }) 
        
           socket.on('addtogroup',(data)=>{
            Group.create({
                groupId:data.groupId,
                Members:data.id
            })
           })

        socket.on('join-room',room=>{
            socket.join(room)
           })

        socket.on("sendInfo",(data1)=>{
             Massage.findAll(
                {
                where:{
                    groupId:data1.groupId
                }
           }
            )
            .then(data=>{
                console.log('massage received')
                Group.findAll({
                    where:{
                        groupId:data1.groupId
                    }
                   })
                   .then(response=>{
                    console.log('group data received')
                   
                    socket.emit("receive",{massage:data,response})
                   }) 

               // socket.emit("receive",{massage:`${response[i].name} : ${response[i].massage}`})
            })
        })
        // Massage.findAll()
        // .then(response=>{
        //     for(let i=0;i<response.length;i++)
        //     socket.emit("receive",`${response[i].name} : ${response[i].massage}`)
        // })

        Group.findAll()
        .then(response=>{
            for(let i=0;i<response.length;i++)
            socket.emit('grouplist',{name:response[i].name,groupId:response[i].groupId})
        })
        
        User.findAll()
        .then(response=>{
            for(let i=0;i<response.length;i++)
            socket.emit("friendslist",{name:response[i].name,id:response[i].id})
        })
    
        socket.on("disconnect",()=>{
            console.log("disconnected");
        })
    })
    
   

http.listen(process.env.PORT,()=>{
    console.log(`server is listing to :${process.env.PORT}`)
})


