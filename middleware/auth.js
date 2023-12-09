"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const authenticate = ((req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jsonwebtoken_1.default.verify(token, 'secretKey');
        user_1.default.findByPk(user.userId).then((user) => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch((err) => {
            console.log(err);
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ success: false });
    }
});
exports.default = authenticate;
