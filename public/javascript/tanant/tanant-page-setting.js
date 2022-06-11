//tanant member page
const myHouseBtn = document.getElementById('my-rent-house');
const reserveBtn = document.getElementById('reserve-house');

function changeReserveBlock(){
    const myHouseBlock = document.getElementById('myrenthouse-list-block');
    const reserveHouseBlock = document.getElementById('reservehouse-list-block');
    myHouseBtn.className = "btn-default";
    reserveBtn.className = "btn-use";
    myHouseBlock.style.display = "none";
    reserveHouseBlock.style.display = "block";
};

function changeMyHouseBlock(){
    const myHouseBlock = document.getElementById('myrenthouse-list-block');
    const reserveHouseBlock = document.getElementById('reservehouse-list-block');
    myHouseBtn.className = "btn-use";
    reserveBtn.className = "btn-default";
    myHouseBlock.style.display = "block";
    reserveHouseBlock.style.display = "none";
};

myHouseBtn.addEventListener("click",changeMyHouseBlock);
reserveBtn.addEventListener("click",changeReserveBlock);

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
        } else if(resJson.data.id[0] !="T"){
            location.replace('/');
        } else if(resJson.data.id[0] =="T"){
            getTanantRentList()
            getReserveList()
        }
    })
};

function getReserveList(){
    fetch('/tanantApi/reserve')
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.data != null){
            createTanantReserveItem(resJson.data)
        }
    })
}

function getTanantRentList(){
    fetch('/tanantApi/rentedList')
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.data != null){
            createRentItem(resJson.data)
        }
    })
}

function createRentItem(data){
    const listScroll = document.getElementById('myrenthouse-list-scroll')
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
        const listLondload = document.createElement('span');
        listLondload.className = "listblock-minsize";
        listLondload.textContent = data[i].londloadName;
        const listPayInfo = document.createElement('span');
        listPayInfo.className = "listblock-minsize";
        if (data[i].status == "X"){
            const redDot = document.createElement('div');
            redDot.className = "red-dot"
            listPayInfo.appendChild(redDot)
        }
        const listPayInfoBtn = document.createElement('button');
        listPayInfoBtn.className = "cashier-info-btn";
        listPayInfoBtn.id = data[i].houseId+'-paylist';
        listPayInfoBtn.textContent = "繳款詳情";
        listPayInfoBtn.addEventListener('click',goTanantPaylist)
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
        listItem.appendChild(listLondload);
        listItem.appendChild(listPayInfo);
        listItem.appendChild(listQuitSpan);
        listScroll.appendChild(listItem)
    }
}

function createTanantReserveItem(data){
    const listScroll = document.getElementById('tanant-reserve-listscroll')
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
        const listAddress = document.createElement('p');
        listAddress.textContent=data[i].houseAddress;
        listTitleSpan.appendChild(listAddress);
        const listPrice = document.createElement('span');
        listPrice.className = "listblock-minsize";
        listPrice.textContent = data[i].rentPrice;
        const listDateTimeSpan = document.createElement('span');
        listDateTimeSpan.className = "listblock-minsize";
        listDateTimeSpan.textContent = data[i].reserveDate +" "+data[i].reserveTime;
        const listPersonSpan = document.createElement('span');
        listPersonSpan.className = "listblock-minsize";
        listPersonSpan.textContent = data[i].londloadCallName;
        const listPhone = document.createElement('span');
        listPhone.className = "listblock-minsize";
        listPhone.textContent = data[i].contactCellphone;
        const listCancel = document.createElement('span');
        listCancel.className = "listblock-minsize";
        const listCancelBtn = document.createElement('button');
        listCancelBtn.className = "quit-rent-btn";
        listCancelBtn.textContent = "取消";
        listCancelBtn.id = data[i].houseId+"-cancel-btn";
        listCancelBtn.addEventListener('click',clickCancelBtn)
        listCancel.appendChild(listCancelBtn);
        listItem.appendChild(listImgSpan);
        listItem.appendChild(listTitleSpan);
        listItem.appendChild(listPrice);
        listItem.appendChild(listDateTimeSpan);
        listItem.appendChild(listPersonSpan);
        listItem.appendChild(listPhone);     
        listItem.appendChild(listCancel);
        listScroll.appendChild(listItem)
    }
}

function clickCancelBtn(){
    let houseID = this.id.split("-cancel-btn")[0];
    const grayBlock = document.getElementById('gray-block');
    const cancelMsg = document.getElementById('cancel-reserve-msg');
    grayBlock.style.display = "block";
    cancelMsg.style.display = "flex";
    document.body.classList.add('stop-scroll');
    const backBtn = document.getElementById('back-btn');
    const sureCancelBtn = document.getElementById('sure-cancel-btn');
    backBtn.addEventListener('click',()=>{
        grayBlock.style.display = "none";
        cancelMsg.style.display = "none";
    })
    grayBlock.addEventListener('click',()=>{
        grayBlock.style.display = "none";
        cancelMsg.style.display = "none";
        document.body.classList.remove("stop-scroll");
    });
    sureCancelBtn.addEventListener('click',deleteReserve.bind(null,houseID))
}

function deleteReserve(houseID){
    document.getElementById('sure-cancel-btn').setAttribute("disabled","disabled");
    setTimeout(()=>{
        document.getElementById('sure-cancel-btn').removeAttribute("disabled")
    },1000)
    fetch('/tanantApi/reserve',{
        method:'DELETE',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({houseId:houseID})
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if(resJson.ok){
            const cancelOkMsg = document.getElementById('cancel-ok-msg');
            cancelOkMsg.style.display='flex';
            const backMemberbtn = document.getElementById('back-member-btn');
            backMemberbtn.addEventListener('click',()=>{
                location.replace('/tanantmember');
            })
        }
    })
}

function goTanantPaylist(){
    const houseID = this.id.split('-paylist')[0]
    location.replace("/tanantmember/pay/"+houseID)
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
    document.getElementById('sure-quitrent-btn').setAttribute("disabled","disabled");
    setTimeout(()=>{
        document.getElementById('sure-quitrent-btn').removeAttribute("disabled")
    },2000)
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