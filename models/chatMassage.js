const Sequelize=require('sequelize')
const sequelize=require('../util/database')
const Massage=sequelize.define('massage',{
    massage:{
        type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    groupId:{
        type:Sequelize.STRING
    }
   
}
);

module.exports=Massage;