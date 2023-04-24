const Sequelize=require('sequelize')
const sequelize=require('../util/database')
const ArchivedMassage=sequelize.define('archivedmassage',{
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

module.exports=ArchivedMassage;