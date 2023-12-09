const ul= document.getElementById('ul') as HTMLUListElement;
var date_val=null;
import axios from 'axios';
const show_leaderBoard= document.getElementById('showleaderboard') as HTMLDivElement;
const razor_pay=document.getElementById('razor') as HTMLInputElement;
import Razorpay from 'razorpay';

window.addEventListener('load',async (req:any,res:any) => {   ///////NOT WORKING
    const token= localStorage.getItem('token');
    const all_expense= await axios.get('http://localhost:4000/user/getExpense',{headers: {'Authorization': token}});
    console.log("all_expenses",all_expense);
    if(all_expense.data.isPremiumUser){
        show_leaderBoard.classList.remove('hide')
        razor_pay.classList.add('hide')
    }
    all_expense.data.response.forEach((element:any) => {
        displayExpense(element);
        
    });
    


})

const form= document.getElementById('daily_expense') as HTMLFormElement;
form.addEventListener('submit', addDailyExpense);
function addDailyExpense(e:any){
    e.preventDefault();
    console.log("inside addDailyExpense");
    const date= e.target.date.value;
    date_val= date;
    const amount=e.target.amount.value;
    const description= e.target.description.value;
    const category= e.target.category.value;

    const expense={
        date,amount,description,category
    }
    const token= localStorage.getItem('token');

   axios.post('http://localhost:4000/user/dailyExpense',expense , {headers: {'Authorization': token}}).then(response => {console.log(response)}).catch(err => {console.log(err)});

}

function displayExpense(expense:any){
    const li = document.createElement('li');
    console.log(expense);
    const span1= document.createElement('span');
    const span2= document.createElement('span');
    const span3= document.createElement('span');
    const span4= document.createElement('span');

    span4.textContent = expense.date+"    ";
    span1.textContent = expense.amount+"    ";
    span2.textContent = expense.description+"    ";
    span3.textContent = expense.category+"       ";

    li.appendChild(span4);
    li.appendChild(span1);
    li.appendChild(span2);
    li.appendChild(span3);

    const button= document.createElement('button');
    button.textContent = "DELETE";
    const token= localStorage.getItem('token');
    button.onclick  =()=>{

        axios.delete('http://localhost:4000/user/delete/' + expense.id,{headers: {'Authorization': token}})
        .then((res)=>{
            if(res.status == 200)
                ul.removeChild(li)
        })
        .catch(e => console.log(e))
    }
    li.appendChild(button);
    ul.appendChild(li);

    date_val= expense.date;
}


show_leaderBoard.addEventListener('click' , showLeaderboard)
    async function showLeaderboard(){
        const token=localStorage.getItem('token');
        console.log(token)
        const userLeaderboard= await axios.get('http://localhost:4000/premium/showLeaderboard',{headers:{"Authorization":token}});
        console.log("userLeaderboard",userLeaderboard);
        var leaderboard_UL= document.getElementById('leaderboard') as HTMLUListElement;
        leaderboard_UL.innerHTML+='<h1>Leader Board</h1>';
        userLeaderboard.data.forEach((user:any) => {
            const leaderboard_LI= document.createElement('li');
            leaderboard_LI.innerText=`Name--${user.name} Total Expense--${user.total_expense}`
            leaderboard_UL.appendChild(leaderboard_LI);
        })
    }


razor_pay.onclick= async function(e){
    const token= localStorage.getItem('token');
    const response= await axios.get('http://localhost:4000/user/premiumMembership',{headers:{"Authorization":token}});
    console.log("response",response);
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response:any){
           const result= await axios.post('http://localhost:4000/user/updateTransaction',{
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id,  

        }, {headers:{"Authorization":token}})

        console.log(result);
        alert("You are a premium user now");
        localStorage.setItem('token',result.data.token);
        const isPremiumUser=true;
        if(isPremiumUser) {
            console.log("hiiii");
            show_leaderBoard.classList.remove('hide')
            razor_pay.classList.add('hide')
            showLeaderboard();
        }
        },// ispremium : true / false
    };
    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',function(response:any){
        console.log(response);
        alert("Something went wrong");
    }); 
}


const dwm= document.getElementById('report') as HTMLButtonElement;
dwm.addEventListener('click',showButtons);
function showButtons(e:any){
    e.preventDefault();
    window.location="report_expense.html" as (string & Location);
}







