const login= document.getElementById('login');
login.addEventListener('submit', checkUser);

function checkUser(e){
    e.preventDefault()
    const name= e.target.name.value;
    const email= e.target.email.value;
    const password= e.target.password.value;

    const user={
        name,email,password
    }

    axios.post('http://localhost:4000/user/login',user).then((response)=>{
        console.log(response);
    }).catch(err => {
        console.log(err);
    })
}