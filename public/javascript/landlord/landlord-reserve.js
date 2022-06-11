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
        } else if(resJson.data.id[0] !="L"){
            location.replace('/');
        } else if(resJson.data.id[0] =="L"){
            getReserveList()
        }
    })
};

function getReserveList(){
    const houseId = window.location.href.split('=')[window.location.href.split('=').length-1]
    fetch('/landlordApi/reserve?house='+houseId)
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.data != null){
            createReserveItem(resJson.data)
            createDetailBlock(resJson.data)
        }
    })
}

function createReserveItem(data){
    const listScroll = document.getElementById('landlord-reserve-listscroll')
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
        const listDateTimeSpan = document.createElement('span');
        listDateTimeSpan.className = "listblock-minsize";
        listDateTimeSpan.textContent = data[i].reserveDate +" "+data[i].reserveTime;
        const listPersonSpan = document.createElement('span');
        listPersonSpan.className = "listblock-minsize";
        listPersonSpan.textContent = data[i].tenantName;
        const listPhone = document.createElement('span');
        listPhone.className = "listblock-minsize";
        listPhone.textContent = data[i].reservePhone
        const listDetail = document.createElement('span');
        listDetail.className = "listblock-minsize";
        const listDetailBtn = document.createElement('button');
        listDetailBtn.className = "light-green-btn";
        listDetailBtn.id=data[i].reserveId+"-detail-btn"
        listDetailBtn.textContent = "詳情";
        listDetailBtn.addEventListener('click',clickDetailBtn)
        listDetail.appendChild(listDetailBtn);
        const listRentOut = document.createElement('span');
        listRentOut.className = "listblock-minsize";
        const listRentOutBtn = document.createElement('button');
        listRentOutBtn.className = "cashier-info-btn";
        listRentOutBtn.id = data[i].tenantId+"-rent-out";
        listRentOutBtn.addEventListener('click',clickRentOutBtn)
        listRentOutBtn.textContent = "租此房客";
        listRentOut.appendChild(listRentOutBtn);
        listItem.appendChild(listImgSpan);
        listItem.appendChild(listTitleSpan);
        listItem.appendChild(listDateTimeSpan);
        listItem.appendChild(listPersonSpan);
        listItem.appendChild(listPhone);
        listItem.appendChild(listDetail);
        listItem.appendChild(listRentOut);
        listScroll.appendChild(listItem)
    }
}

function createDetailBlock(data){
    for (i=0;i<data.length;i++){
        const sectionDetail = document.getElementById('section-detail');
        const reserveDetailBlock = document.createElement('div');
        reserveDetailBlock.className="reserve-detail-block";
        reserveDetailBlock.id=data[i].reserveId+"-reserve-detail"
        const detailTitle = document.createElement('div');
        detailTitle.className = "detail-title";
        const detailTitleH3 = document.createElement('h3');
        detailTitleH3.textContent = "預約詳情";
        const detailImgBtn = document.createElement('button');
        detailImgBtn.id = data[i].reserveId+"-close-btn"
        const detailImg = document.createElement('img');
        detailImg.src="/public/images/carbon_close-filled.png";
        detailImgBtn.appendChild(detailImg);
        detailTitle.appendChild(detailTitleH3)
        detailTitle.appendChild(detailImgBtn)
        const detailDataBlock = document.createElement('div');
        detailDataBlock.className="detail-data";
        //time
        const reserveTime = document.createElement('div');
        reserveTime.className="detail-list";
        const timeTitle = document.createElement('span');
        const timeData = document.createElement('span');
        timeTitle.textContent = "預約時間";
        timeData.textContent = data[i].reserveDate+" "+data[i].reserveTime;
        timeTitle.className="detail-list-title";
        timeData.className="detail-list-data";
        reserveTime.appendChild(timeTitle);
        reserveTime.appendChild(timeData);
        const hr1= document.createElement('hr')
        //tenant
        const reserveTenant = document.createElement('div');
        reserveTenant.className="detail-list";
        const tenantTitle = document.createElement('span');
        const tenantData = document.createElement('span');
        tenantTitle.textContent = "預約房客";
        tenantData.textContent = data[i].tenantName;
        tenantTitle.className="detail-list-title";
        tenantData.className="detail-list-data";
        reserveTenant.appendChild(tenantTitle);
        reserveTenant.appendChild(tenantData);
        const hr2= document.createElement('hr')
        //phone
        const reservePhone = document.createElement('div');
        reservePhone .className="detail-list";
        const phoneTitle = document.createElement('span');
        const phoneData = document.createElement('span');
        phoneTitle.textContent = "聯絡電話";
        phoneData.textContent = data[i].reservePhone;
        phoneTitle.className="detail-list-title";
        phoneData.className="detail-list-data";
        reservePhone.appendChild(phoneTitle);
        reservePhone.appendChild(phoneData);
        const hr3= document.createElement('hr')
        //question
        const reserveQuestion = document.createElement('div');
        reserveQuestion .className="detail-list";
        const questionTitle = document.createElement('span');
        const questionData = document.createElement('span');
        questionTitle.textContent = "預約提問";
        questionData.textContent = data[i].otherQuestion;
        questionTitle.className="detail-list-title";
        questionData.className="detail-list-data";
        reserveQuestion.appendChild(questionTitle);
        reserveQuestion.appendChild(questionData);
        const hr4= document.createElement('hr')
        //button
        const detailTwoBtn = document.createElement('div');
        detailTwoBtn.className = "detail-two-btn";
        const cancelBtn = document.createElement('button');
        cancelBtn.className = "red-btn";
        cancelBtn.id = data[i].reserveId+"-cancel-btn";
        cancelBtn.textContent = "取消預約";
        const checkokBtn = document.createElement('button');
        checkokBtn.className = "sm-dark-green-btn";
        checkokBtn.textContent = "確認內容";
        checkokBtn.id = data[i].reserveId+"-ok-btn";
        detailTwoBtn.appendChild(cancelBtn);
        detailTwoBtn.appendChild(checkokBtn);
        //sum
        detailDataBlock.appendChild(reserveTime);
        detailDataBlock.append(hr1);
        detailDataBlock.appendChild(reserveTenant);
        detailDataBlock.append(hr2);
        detailDataBlock.appendChild(reservePhone);
        detailDataBlock.append(hr3);
        detailDataBlock.appendChild(reserveQuestion);
        detailDataBlock.append(hr4);
        detailDataBlock.appendChild(detailTwoBtn);
        reserveDetailBlock.appendChild(detailTitle);
        reserveDetailBlock.appendChild(detailDataBlock);
        sectionDetail.appendChild(reserveDetailBlock);
    }
}

function clickDetailBtn(){
    let detailId = this.id.split("-detail-btn")[0];
    const getBlock = document.getElementById(detailId+"-reserve-detail");
    const grayBlock = document.getElementById('gray-block');
    const closeBtn = document.getElementById(detailId+"-close-btn")
    grayBlock.style.display="block";
    getBlock.style.display="block";
    document.body.classList.add('stop-scroll');
    const cancelBtn = document.getElementById(detailId+"-cancel-btn");
    const okBtn = document.getElementById(detailId+"-ok-btn");
    const cancelReserveMsg = document.getElementById('cancel-reserve-msg');
    const cancelOkMsg = document.getElementById('cancel-ok-msg');
    grayBlock.addEventListener('click',()=>{
        grayBlock.style.display="none";
        getBlock.style.display="none";
        cancelReserveMsg.style.display="none"
        cancelOkMsg.style.display='none';
        document.body.classList.remove('stop-scroll');
    })
    okBtn.addEventListener("click",()=>{
        grayBlock.style.display="none";
        getBlock.style.display="none";
        document.body.classList.remove('stop-scroll');
    })
    closeBtn.addEventListener("click",()=>{
        grayBlock.style.display="none";
        getBlock.style.display="none";
        document.body.classList.remove('stop-scroll');
    })
    cancelBtn.addEventListener("click",()=>{
        cancelReserveMsg.style.display = "flex"
        const backBtn = document.getElementById('back-btn');
        const sureCancelBtn = document.getElementById('sure-cancel-btn');
        backBtn.addEventListener('click',()=>{
            cancelReserveMsg.style.display = "none"
        })
        sureCancelBtn.addEventListener('click',deleteLandlordReserve.bind(null,detailId))
    })
}

function deleteLandlordReserve(listId){
    document.getElementById('sure-cancel-btn').setAttribute('disabled','disabled');
    setTimeout(()=>{
        document.getElementById('sure-cancel-btn').removeAttribute("disabled")
    },2000)
    fetch('/landlordApi/reserve',{
        method:'DELETE',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({listID:listId})
    })
    .then((res)=>{
        return res.json();
    })
    .then((resJson)=>{
        if (resJson.ok){
            const cancelOkMsg = document.getElementById('cancel-ok-msg');
            cancelOkMsg.style.display='flex';
            const backMemberbtn = document.getElementById('back-member-btn');
            const reloadBtn = document.getElementById('reload-btn');
            backMemberbtn.addEventListener('click',()=>{
                location.replace('/landlordmember');
            })
            reloadBtn.addEventListener('click',()=>{
                location.reload();
            })
        }
    })
} 

function clickRentOutBtn(){
    const getTenantId = this.id.split('-rent-out')[0];
    const grayBlock = document.getElementById('gray-block');
    const checkRentoutMsg = document.getElementById('check-rentout-msg');
    checkRentoutMsg.style.display =' flex';
    grayBlock.style.display="block";
    document.body.classList.add('stop-scroll');
    const rentoutBackBtn = document.getElementById('rentout-back-btn');
    const sureRentoutBtn = document.getElementById('sure-rentout-btn');
    grayBlock.addEventListener('click',()=>{
        grayBlock.style.display="none";
        checkRentoutMsg.style.display =' none';
        document.body.classList.remove('stop-scroll');
    })
    rentoutBackBtn.addEventListener('click',()=>{
        grayBlock.style.display="none";
        checkRentoutMsg.style.display =' none';
        document.body.classList.remove('stop-scroll');
    })
    sureRentoutBtn.addEventListener('click',rentOut.bind(null,getTenantId))
}

function rentOut(tenantId){
    document.getElementById('sure-rentout-btn').setAttribute("disabled","disabled")
    setTimeout(()=>{
        document.getElementById('sure-rentout-btn').removeAttribute("disabled")
    },2000)
    const houseId = window.location.href.split('=')[window.location.href.split('=').length-1]
    fetch('/landlordApi/rentOutHouse',{
        method:'PUT',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({tenantID:tenantId,houseID:houseId})
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.ok){
            location.reload();
        }
    })
}