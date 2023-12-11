const form= document.getElementById('my-form')
form.addEventListener('submit', addUser);

// import axios from 'axios';

function addUser(e){
    e.preventDefault();
    const name= e.target.name.value;
    const email= e.target.email.value;
    const password= e.target.password.value;

    const user={
        name,email,password
    }

    const post= axios.post('http://54.91.64.16:4000/user/signup',user).then((response)=>{
        console.log(response);
        window.location="login.html";
    }).catch(err => {
        console.log(err);
    })
} 

