const dot_env= require('dotenv');
dot_env.config();

const Sequelize= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{dialect:'mysql', host: 'localhost'});

module.exports= sequelize;