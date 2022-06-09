//londload member page
const rentManageBtn = document.getElementById('rent-manage');
const noRentManageBtn = document.getElementById('not-rent-manage');
const myAccountBtn = document.getElementById('londload-account');

function changeNoRentBlock(){
    const rentBlock = document.getElementById('renthouse-list-block');
    const notRentBlock = document.getElementById('notrenthouse-list-block');
    const myAccountBlock = document.getElementById('my-account-block');
    noRentManageBtn.className = "btn-use";
    rentManageBtn.className = "btn-default";
    myAccountBtn.className = "btn-default";
    rentBlock.style.display = "none";
    myAccountBlock.style.display = "none";
    notRentBlock.style.display = "block";
}

function changeRentBlock(){
    const rentBlock = document.getElementById('renthouse-list-block');
    const notRentBlock = document.getElementById('notrenthouse-list-block');
    const myAccountBlock = document.getElementById('my-account-block');
    noRentManageBtn.className = "btn-default";
    rentManageBtn.className = "btn-use";
    myAccountBtn.className = "btn-default";
    myAccountBlock.style.display = "none";
    notRentBlock.style.display = "none";
    rentBlock.style.display = "block";
}

function changeMyAccountBlock(){
    const rentBlock = document.getElementById('renthouse-list-block');
    const notRentBlock = document.getElementById('notrenthouse-list-block');
    const myAccountBlock = document.getElementById('my-account-block');
    noRentManageBtn.className = "btn-default";
    rentManageBtn.className = "btn-default";
    myAccountBtn.className = "btn-use";
    myAccountBlock.style.display = "block";
    notRentBlock.style.display = "none";
    rentBlock.style.display = "none";
}

rentManageBtn.addEventListener("click",changeRentBlock);
noRentManageBtn.addEventListener("click",changeNoRentBlock);
myAccountBtn.addEventListener("click",changeMyAccountBlock);

getUserStatus()

function getUserStatus(){
    fetch('/api/member',{
        method:'GET'
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if(resJson.data == null){
            location.replace('/');
        } else if (resJson.data.id[0] !="L"){
            location.replace('/');
        } else if(resJson.data.id[0] =="L"){
            getNoRentList();
            getRentList();
            getAccountAmount();
        }
    })
};

function getNoRentList(){
    fetch('/londloadApi/notRentedList',{
        method:'GET'
    })
    .then((res)=>{
        return res.json();
    })
    .then((resJson)=>{
        createNoRentItem(resJson.data)
    })
}

function getRentList(){
    fetch('/londloadApi/rentedList',{
        method:'GET'
    })
    .then((res)=>{
        return res.json();
    })
    .then((resJson)=>{
        createRentItem(resJson.data)
    })
}

function createNoRentItem(data){
    const listScroll = document.getElementById('not-rentlist-scroll')
    for (i=0;i<data.length;i++){
        const listItem = document.createElement('div');
        listItem.className = "house-list-item"
        const listImgSpan = document.createElement('span');
        listImgSpan.className="list-house";
        const listImg = document.createElement('img');
        listImg.src = data[i].imgUrl;
        listImgSpan.appendChild(listImg);
        const listTitleSpan = document.createElement('span');
        listTitleSpan.className="listblock-bigsize";
        listTitleSpan.textContent=data[i].houseName;
        const listRentPriceSpan = document.createElement('span');
        listRentPriceSpan.className = "listblock-minsize";
        listRentPriceSpan.textContent = data[i].rentPrice;
        const listDate = document.createElement('span');
        listDate.className = "listblock-minsize";
        listDate.textContent = data[i].buildDate;
        const listReserve = document.createElement('span');
        listReserve.className = "listblock-minsize";
        const listReserveBtn = document.createElement('button');
        listReserveBtn.className = "cashier-info-btn";
        listReserveBtn.textContent = "查看預約";
        listReserveBtn.id = data[i].houseId + "-reserve-btn"
        listReserveBtn.addEventListener("click",goReservePage)
        listReserve.appendChild(listReserveBtn);
        const listFixInfo = document.createElement('span');
        listFixInfo.className = "listblock-minsize";
        const listFixInfoBtn = document.createElement('button');
        listFixInfoBtn.className = "cashier-info-btn";
        listFixInfoBtn.textContent = "修改資訊";
        listFixInfoBtn.id = data[i].houseId + "-fixhouse-btn";
        listFixInfoBtn.addEventListener('click',goFixFrom)
        listFixInfo.appendChild(listFixInfoBtn);
        const listDelete = document.createElement('span');
        listDelete.className = "listblock-minsize";
        const listDeleteBtn = document.createElement('button');
        listDeleteBtn.className = "quit-rent-btn";
        listDeleteBtn.textContent = "刪除";
        listDeleteBtn.id = data[i].houseId + "-delete-data-btn";
        listDeleteBtn.addEventListener('click',deleteHouseData)
        listDelete.appendChild(listDeleteBtn);
        listItem.appendChild(listImgSpan);
        listItem.appendChild(listTitleSpan);
        listItem.appendChild(listRentPriceSpan);
        listItem.appendChild(listDate);
        listItem.appendChild(listReserve);
        listItem.appendChild(listFixInfo);
        listItem.appendChild(listDelete);
        listScroll.appendChild(listItem)
    }
}

function createRentItem(data){
    const listScroll = document.getElementById('rentlist-scroll')
    for (i=0;i<data.length;i++){
        const listItem = document.createElement('div');
        listItem.className = "house-list-item"
        const listImgSpan = document.createElement('span');
        listImgSpan.className="list-house";
        const listImg = document.createElement('img');
        listImg.src = data[i].imgUrl;
        listImgSpan.appendChild(listImg);
        const listTitleSpan = document.createElement('span');
        listTitleSpan.className="listblock-bigsize";
        listTitleSpan.textContent=data[i].houseName;
        const listRentPriceSpan = document.createElement('span');
        listRentPriceSpan.className = "listblock-minsize";
        listRentPriceSpan.textContent = data[i].rentPrice;
        const listDate = document.createElement('span');
        listDate.className = "listblock-minsize";
        listDate.textContent = data[i].buildDate;
        const listTanant = document.createElement('span');
        listTanant.className = "listblock-minsize";
        listTanant.textContent = data[i].tanantName;
        const listPayInfo = document.createElement('span');
        listPayInfo.className = "listblock-minsize";
        const listPayInfoBtn = document.createElement('button');
        listPayInfoBtn.className = "cashier-info-btn";
        listPayInfoBtn.id = data[i].houseId+'-paylist';
        listPayInfoBtn.textContent = "繳款詳情";
        listPayInfoBtn.addEventListener('click',goPaylist)
        listPayInfo.appendChild(listPayInfoBtn);
        const listQuitSpan = document.createElement('span');
        listQuitSpan.className = "listblock-minsize";
        const listQuitBtn = document.createElement('button');
        listQuitBtn.className = "quit-rent-btn";
        listQuitBtn.textContent = "退租";
        listQuitBtn.id = data[i].houseId + "-quitrent-btn";
        listQuitBtn.addEventListener('click',quitRent)
        listQuitSpan.appendChild(listQuitBtn);
        listItem.appendChild(listImgSpan);
        listItem.appendChild(listTitleSpan);
        listItem.appendChild(listRentPriceSpan);
        listItem.appendChild(listDate);
        listItem.appendChild(listTanant);
        listItem.appendChild(listPayInfo);
        listItem.appendChild(listQuitSpan);
        listScroll.appendChild(listItem)
    }
}

function goReservePage(){
    let houseID = this.id.split("-reserve-btn")[0];
    window.location.href="/londloadmember/reserve?house="+ houseID;
}

function deleteHouseData(){
    let houseID = this.id.split("-delete-data-btn")[0];
    const grayblock = document.getElementById('gray-block');
    const deleteHouseMsg = document.getElementById('delete-house-msg');
    grayblock.style.display = "block";
    deleteHouseMsg.style.display = "flex";
    document.body.classList.add('stop-scroll');
    const backBtn = document.getElementById('backto-btn');
    const sureDeleteBtn = document.getElementById('sure-delete-btn');
    backBtn.addEventListener('click',()=>{
        grayblock.style.display = "none";
        deleteHouseMsg.style.display = "none";
        document.body.classList.remove('stop-scroll');
    })
    grayblock.addEventListener('click',()=>{
        grayblock.style.display = "none";
        deleteHouseMsg.style.display = "none";
        document.body.classList.remove('stop-scroll');
    })
    sureDeleteBtn.addEventListener('click',sureDeleteHouse.bind(null,houseID))
}

function sureDeleteHouse(houseID){
    fetch('/londloadApi/house',{
        method:'DELETE',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({houseId:houseID})
    })
    .then((res)=>{
        return res.json();
    })
    .then((resJson)=>{
        if (resJson.ok){
            location.reload();
        }
    })
}

function goPaylist(){
    const houseID = this.id.split('-paylist')[0]
    location.replace("/londloadmember/pay/"+houseID)
}

function quitRent(){
    const houseID = this.id.split('-quitrent-btn')[0];
    const grayblock = document.getElementById('gray-block');
    const quitRentMsg = document.getElementById('quit-rent-msg');
    grayblock.style.display = "block";
    quitRentMsg.style.display = "flex";
    document.body.classList.add('stop-scroll');
    const backBtn = document.getElementById('quitrent-back-btn');
    const sureDeleteBtn = document.getElementById('sure-quitrent-btn');
    backBtn.addEventListener('click',()=>{
        grayblock.style.display = "none";
        quitRentMsg.style.display = "none";
        document.body.classList.remove('stop-scroll');
    })
    grayblock.addEventListener('click',()=>{
        grayblock.style.display = "none";
        quitRentMsg.style.display = "none";
        document.body.classList.remove('stop-scroll');
    })
    sureDeleteBtn.addEventListener('click',sureQuitRent.bind(null,houseID))
}

function sureQuitRent(houseId){
    fetch('/api/quitRent',{
        method:'DELETE',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({houseId:houseId})
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.msg == "delete ok"){
            const msgblock = document.getElementById('quitrent-success-msg');
            const quitRentMsg = document.getElementById('quit-rent-msg');
            const grayblock = document.getElementById('gray-block');
            grayblock.style.display = "block";
            quitRentMsg.style.display = "none"
            msgblock.style.display = "flex";
            document.getElementById('success-ok-btn').addEventListener('click',()=>{
                location.reload();
            })
        } else if (resJson.msg == "wait"){
            const msgblock = document.getElementById('quitrent-wait-msg');
            const quitRentMsg = document.getElementById('quit-rent-msg');
            const grayblock = document.getElementById('gray-block');
            grayblock.style.display = "block";
            quitRentMsg.style.display = "none"
            msgblock.style.display = "flex";
            document.getElementById('sure-success-btn').addEventListener('click',()=>{
                location.reload();
            })
        }
    })
}

function goFixFrom(){
    const houseID = this.id.split('-fixhouse-btn')[0]
    location.replace("/londloadmember/fixhouse/"+houseID)
}

function getAccountAmount(){
    fetch('/londloadApi/accountAmount')
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        document.getElementById('account_amount').textContent = '$ ' + resJson.data.amount;
        document.getElementById('bank-username').value = resJson.data.londloadName;
    })
}

document.getElementById('take-money').addEventListener('change',()=>{
    document.getElementById('actual-money').value = document.getElementById('take-money').value - 15;
})

function insertRecord(e){
    e.preventDefault();
    const amount = Number(document.getElementById('account_amount').textContent.split(' ')[1]);
    const getMoney = Number(document.getElementById('take-money').value);
    const bankUsername = document.getElementById('bank-username').value;
    const bankNum = document.getElementById('bank-num').value;
    const bankAccount = document.getElementById('bank-account').value;
    const actualMoney = document.getElementById('actual-money').value;
    const today = new Date();
    const dateNow =  today.getFullYear()+ "-" + (today.getMonth()+1) + "-" + today.getDate();
    const balance = Number(amount-getMoney);
    if (getMoney > amount){
        document.getElementById('take-err-msg').textContent = "金額輸入錯誤，不得超過帳戶金額"
        return
    } else if (actualMoney <= 0){
        document.getElementById('take-err-msg').textContent = "實際入帳金額不得為負"
    } else {
        document.getElementById('pay-submit').setAttribute('disabled','disabled');
        setTimeout(()=>{
            document.getElementById('pay-submit').removeAttribute("disabled")
        },2000)
        fetch('/londloadApi/accountAmount',{
            method:'PUT',
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({balance:balance,getMoney:getMoney,bankUsername:bankUsername,bankNum:bankNum,bankAccount:bankAccount,actualMoney:actualMoney,dateNow:dateNow})
        })
        .then((res)=>{
            return res.json()
        })
        .then((resJson)=>{
            if (resJson.ok){
                document.getElementById('money-sueecss-msg').style.display= "flex";
                document.getElementById('gray-block').style.display = "block";
                document.getElementById('sure-money-btn').addEventListener('click',()=>{
                    location.reload();
                })
            }  
        })
    }
}