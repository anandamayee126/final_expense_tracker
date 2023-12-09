import Sequelize from 'sequelize';
import sequelize from '../util/db';
const Expense= sequelize.define('expense',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false,

    },
    amount:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

export default Expense;