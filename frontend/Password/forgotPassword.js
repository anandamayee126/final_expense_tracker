const form= document.getElementById('form')
form.addEventListener('submit',sendMail);


async function sendMail(e){
    e.preventDefault();
    const email=e.target.email.value;
    // const token= localStorage.getItem('token')
    console.log(email);
    const token= localStorage.getItem('token');
    const send_email= await axios.post('http://localhost:4000/user/forgetPassword',{email},{headers: {'Authorization': token}});
    console.log(send_email);
}