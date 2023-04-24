const { Sequelize } = require("sequelize");

const sequelize=new Sequelize('chatapp',"root","Banarasi#0542",{
    dialect:'mysql',
    host:"localhost"
})

module.exports=sequelize;