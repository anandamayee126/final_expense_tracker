const daily_form= document.getElementById('daily_form')
daily_form.addEventListener('submit',showDaily);

// const axios from 'axios';

async function showDaily(e){
    e.preventDefault();
    const date= e.target.date.value;
    console.log(date);
    const token= localStorage.getItem('token');
    const result= await axios.post('http://localhost:4000/premium/getdaily',{date},{headers:{"Authorization":token}});
    console.log("result_front", result);

    const table= document.getElementById('table')
    const td_date= document.createElement('td');
    const td_amount= document.createElement('td');
    const td_description= document.createElement('td');
    const tr= document.createElement('tr');
    
    td_date.textContent= "Date";
    td_amount.textContent= "Amount";
    td_description.textContent= "Description";
    tr.appendChild(td_date);
    tr.appendChild(td_amount);
    tr.appendChild(td_description);
    table.appendChild(tr);
    result.data.forEach((expenses)=>{
        const td_date_value = document.createElement('td');
        const td_amount_value = document.createElement('td');
        const td_description_value = document.createElement('td');
        const tr_value= document.createElement('tr');
        td_date_value.textContent= expenses.date;
        td_amount_value.textContent= expenses.amount;
        td_description_value.textContent= expenses.description;
        tr_value.appendChild(td_date_value);
        tr_value.appendChild(td_amount_value);
        tr_value.appendChild(td_description_value);
        table.appendChild(tr_value);
    })
    const download_btn= document.createElement('button');
    download_btn.textContent = 'Download Report';
    download_btn.name="download";
    
    // const token= localStorage.getItem('token');
    download_btn.onclick=()=>{
        axios.post('http://localhost:4000/premium/downloadExpense',{data:result.data},{headers: {'Authorization': token}})
        .then((response)=>{
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    table.appendChild(download_btn);
    
}