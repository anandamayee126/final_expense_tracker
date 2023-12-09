"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form = document.getElementById('form');
form.addEventListener('submit', sendMail);
const axios_1 = __importDefault(require("axios"));
async function sendMail(e) {
    e.preventDefault();
    const email = e.target.email.value;
    // const token= localStorage.getItem('token')
    console.log(email);
    const send_email = await axios_1.default.post('http://localhost:4000/user/forgetPassword', { email });
    console.log(send_email);
}
