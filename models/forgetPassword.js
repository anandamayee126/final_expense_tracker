const Sequelize= require('sequelize');
const sequelize= require('../util/db');
const FP= sequelize.define('fp',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
})

module.exports= FP;