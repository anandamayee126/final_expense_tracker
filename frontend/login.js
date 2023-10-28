const login= document.getElementById('login');
login.addEventListener('submit', checkUser);

async function checkUser(e){
    e.preventDefault()
    const name= e.target.name.value;
    const email= e.target.email.value;
    const password= e.target.password.value;

    const user={
        name,email,password
    }

    
    const login= await axios.post('http://localhost:4000/user/login',user)
    
    console.log("login",login);
    // if(login.data.success==true){
        //window.location="daily_expense.html";
    // }
    console.log(login.data.token);
    
}