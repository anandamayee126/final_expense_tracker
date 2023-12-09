"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db_1 = __importDefault(require("../util/db"));
const Expense = db_1.default.define('expense', {
    id: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: sequelize_1.default.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
    },
    description: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    category: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    }
});
exports.default = Expense;
