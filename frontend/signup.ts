const form= document.getElementById('my-form') as HTMLFormElement;
form.addEventListener('submit', addUser);

import axios from 'axios';

function addUser(e:any){
    e.preventDefault();
    const name= e.target.name.value;
    const email= e.target.email.value;
    const password= e.target.password.value;

    const user={
        name,email,password
    }

    const post= axios.post('http://localhost:4000/user/signup',user).then((response:any)=>{
        console.log(response);
        window.location="login.html" as (string & Location);
    }).catch(err => {
        console.log(err);
    })
} 

