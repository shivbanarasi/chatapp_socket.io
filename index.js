const express=require('express');
const path=require('path')
const sequelize=require('./util/database')
require('dotenv').config();
const User=require('./models/user')
const Massage=require('./models/chatMassage')
const ArchiveMassage=require('./models/ArchivedChat')
const route=require('./route/route')
const cron = require("node-cron");
const bodyParser=require('body-parser');
const AWS=require('aws-sdk')
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
   // {force:true}
    );

    io.on("connection",socket=>{
        console.log(socket.id);
const fileURL="";
        socket.on("send",(data,room)=>{
            const myArray = data.file.split("/");
            if(data.file!=null){
                const datae=data.file;
    const filename=`${myArray[myArray.length-1]}`;
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        bucket:BUCKET_NAME
    })

    s3bucket.createBucket(()=>{
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:datae,
            ACL:'public-read'
        }
       
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('something went wrong',err)
                   
                }else{
                    console.log('success',s3response.Location)
                  fileURL=s3response.Location;
                  
}
            })
        })
            }
        
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
            io.emit("instent",{massage:`${data.name} : ${data.massage}`,response,fileURL})
           }) 
           }) 
        
           socket.on('addtogroup',(data)=>{
            Group.create({
                groupId:data.groupId,
                Members:data.id
            })
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
    
    cron.schedule(
        //'0 0 * * 1-6',
        '1 * * * *',
        function() {
            console.log('You will see this message every second');
            sequelize.query(`INSERT INTO archivedmassages SELECT * FROM massages WHERE createdAt<=date_sub(current_timestamp,interval 1 day)`)
            sequelize.query('DELETE FROM massages WHERE createdAt<=date_sub(current_timestamp,interval 1 day)')
        },
        
    );  
    

http.listen(process.env.PORT,()=>{
    console.log(`server is listing to :${process.env.PORT}`)
})


