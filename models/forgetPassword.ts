import Sequelize from 'sequelize';
import sequelize from '../util/db';
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

export default FP;