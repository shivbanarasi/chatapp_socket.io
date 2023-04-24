const Sequelize=require('sequelize');
const sequelize=require('../util/database')
const User=sequelize.define("user",{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    phone:{
        type:Sequelize.BIGINT,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

if(User===sequelize.models.user){
    console.log('user created');
}

module.exports=User;