const Sequelize = require('sequelize');
import dot_env from 'dotenv';
dot_env.config();
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{dialect:'mysql', host: 'localhost'});

export default sequelize;