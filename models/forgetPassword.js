"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db_1 = __importDefault(require("../util/db"));
const FP = db_1.default.define('fp', {
    id: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    isActive: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: true
    }
});
exports.default = FP;
