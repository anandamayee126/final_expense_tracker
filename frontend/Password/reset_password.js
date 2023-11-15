var resetId=null;
window.addEventListener('load' , async()=>{
    let url = window.location.href      
    let arr = url.split("?reset=")
    resetId = arr[1]
    console.log(resetId)
    if(resetId == null || resetId.length == 0){
        alert("wrong link")
        location.href ='forgot-password.html'
    }
    const res = await axios.get(`http://localhost:4000/user/check-password-link/${resetId}`)
    if(!res.data.isActive){
        alert("link expired get a new one")
        location.href ='forgotPassword.html'
    }
    console.log("res of check-password",res);

})

const form= document.getElementById('forgetPassword');
form.addEventListener('submit', updatePassword);

async function updatePassword(e){
    e.preventDefault();
    const newPassword = e.target.new_password.value;
    const token= localStorage.getItem('token');
    const update= await axios.post(`http://localhost:4000/user/update-password/${resetId}`,{newPassword},{headers:{'Authorization':token}});
    alert("Password updated successfully");
    // console.log("update- ",update);
    location.href="../login.html";
    
}