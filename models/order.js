"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db_1 = __importDefault(require("../util/db"));
const Order = db_1.default.define('order', {
    id: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    payment_id: sequelize_1.default.STRING,
    order_id: sequelize_1.default.STRING,
    status: sequelize_1.default.STRING
});
exports.default = Order;
