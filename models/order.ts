import Sequelize from 'sequelize';
import sequelize from '../util/db';
const Order= sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    payment_id:Sequelize.STRING,
    order_id:Sequelize.STRING,
    status: Sequelize.STRING
})

export default Order;