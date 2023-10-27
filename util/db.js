const Sequelize= require('sequelize');
const sequelize= new Sequelize('final_expense','root','Jhumpu@234',{dialect:'mysql', host: 'localhost'});

module.exports= sequelize;