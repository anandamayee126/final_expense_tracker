"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form = document.getElementById('my-form');
form.addEventListener('submit', addUser);
const axios_1 = __importDefault(require("axios"));
function addUser(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const user = {
        name, email, password
    };
    const post = axios_1.default.post('http://localhost:4000/user/signup', user).then((response) => {
        console.log(response);
        window.location = "login.html";
    }).catch(err => {
        console.log(err);
    });
}
