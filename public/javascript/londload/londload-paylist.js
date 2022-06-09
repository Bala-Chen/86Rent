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
            goAddRentBill()
            getHouseBill()
        }
    })
};

function goAddRentBill(){
    const houseId = window.location.href.split('/')[window.location.href.split('/').length-1]
    const addRentbillBtn = document.getElementById('add-rentbill-btn');
    addRentbillBtn.addEventListener('click',()=>{
        location.replace('/londloadmember/pay/'+ houseId +'/addbill')
    })
}

function getHouseBill(){
    const houseId = window.location.href.split('/')[window.location.href.split('/').length-1]
    const payListBtn = document.getElementById('go-paylist-btn');
    payListBtn.href = "/londloadmember/pay/"+ houseId;
    fetch('/londloadApi/pay/'+houseId)
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        console.log(resJson)
        if (resJson.payList == null){
            const main = document.getElementById("main")
            main.innerHTML=""
        } else {
            if (resJson.payList.data == null){
                addListTitle(resJson.payList.houseName,resJson.payList.tanantName)
            } else {
                addListTitle(resJson.payList.houseName,resJson.payList.tanantName)
                createLondloadBillList(resJson.payList.data)
                createBillDetail(resJson.payList.data)
            }
        }
    }) 
}

function createBillDetail(data){
    for (i=0;i<data.length;i++){
        const sectionDetail = document.getElementById('section-detail');
        const reserveDetailBlock = document.createElement('div');
        reserveDetailBlock.className="reserve-detail-block";
        reserveDetailBlock.id=data[i].billId+"-bill-detail"
        const detailTitle = document.createElement('div');
        detailTitle.className = "detail-title";
        const detailTitleH3 = document.createElement('h3');
        detailTitleH3.textContent = "房租細項";
        const detailImgBtn = document.createElement('button');
        const detailImg = document.createElement('img');
        detailImgBtn.id = data[i].billId+"-close-btn"
        detailImg.src="/public/images/carbon_close-filled.png";
        detailImgBtn.appendChild(detailImg);
        detailTitle.appendChild(detailTitleH3)
        detailTitle.appendChild(detailImgBtn)
        const detailDataBlock = document.createElement('div');
        detailDataBlock.className="detail-data";
        //time
        const reserveTime = document.createElement('div');
        reserveTime.className="paydetail-list";
        const timeTitle = document.createElement('span');
        const timeData = document.createElement('span');
        timeTitle.textContent = "租金新增日期";
        timeData.textContent = data[i].setDate;
        timeTitle.className="detail-list-title";
        timeData.className="detail-list-data";
        reserveTime.appendChild(timeTitle);
        reserveTime.appendChild(timeData);
        const hr1= document.createElement('hr')
        //rent
        const rentBill = document.createElement('div');
        rentBill.className="paydetail-list";
        const rentTitle = document.createElement('span');
        const rentData = document.createElement('span');
        rentTitle.textContent = "基本租金";
        rentData.textContent = data[i].infoData.rent;
        rentTitle.className="detail-list-title";
        rentData.className="detail-list-data";
        rentBill.appendChild(rentTitle);
        rentBill.appendChild(rentData);
        const hr2= document.createElement('hr')
        //water
        const waterBill = document.createElement('div');
        waterBill .className="paydetail-list";
        const waterTitle = document.createElement('span');
        const waterData = document.createElement('span');
        waterTitle.textContent = "水費";
        waterData.textContent = data[i].infoData.water;
        waterTitle.className="detail-list-title";
        waterData.className="detail-list-data";
        waterBill.appendChild(waterTitle);
        waterBill.appendChild(waterData);
        const hr3= document.createElement('hr')
        //electric
        const electricBill = document.createElement('div');
        electricBill .className="paydetail-list";
        const electricTitle = document.createElement('span');
        const electricData = document.createElement('span');
        electricTitle.textContent = "電費";
        electricData.textContent = data[i].infoData.electric;
        electricTitle.className="detail-list-title";
        electricData.className="detail-list-data";
        electricBill.appendChild(electricTitle);
        electricBill.appendChild(electricData);
        const hr4= document.createElement('hr')
        //manage
        const manageBill = document.createElement('div');
        manageBill .className="paydetail-list";
        const manageTitle = document.createElement('span');
        const manageData = document.createElement('span');
        manageTitle.textContent = "管理費";
        manageData.textContent = data[i].infoData.manage;
        manageTitle.className="detail-list-title";
        manageData.className="detail-list-data";
        manageBill.appendChild(manageTitle);
        manageBill.appendChild(manageData);
        const hr5= document.createElement('hr')
        //clean
        const cleanBill = document.createElement('div');
        cleanBill.className="paydetail-list";
        const cleanTitle = document.createElement('span');
        const cleanData = document.createElement('span');
        cleanTitle.textContent = "清潔費";
        cleanData.textContent = data[i].infoData.clean;
        cleanTitle.className="detail-list-title";
        cleanData.className="detail-list-data";
        cleanBill.appendChild(cleanTitle);
        cleanBill.appendChild(cleanData);
        const hr6= document.createElement('hr')
        //four
        const fourBill = document.createElement('div');
        fourBill .className="paydetail-list";
        const fourTitle = document.createElement('span');
        const fourData = document.createElement('span');
        fourTitle.textContent = "第四台";
        fourData.textContent = data[i].infoData.four;
        fourTitle.className="detail-list-title";
        fourData.className="detail-list-data";
        fourBill.appendChild(fourTitle);
        fourBill.appendChild(fourData);
        const hr7= document.createElement('hr')
        //net
        const netBill = document.createElement('div');
        netBill .className="paydetail-list";
        const netTitle = document.createElement('span');
        const netData = document.createElement('span');
        netTitle.textContent = "網路費";
        netData.textContent = data[i].infoData.net;
        netTitle.className="detail-list-title";
        netData.className="detail-list-data";
        netBill.appendChild(netTitle);
        netBill.appendChild(netData);
        const hr8= document.createElement('hr')
        //gas
        const gasBill = document.createElement('div');
        gasBill.className="paydetail-list";
        const gasTitle = document.createElement('span');
        const gasData = document.createElement('span');
        gasTitle.textContent = "瓦斯費";
        gasData.textContent = data[i].infoData.gas;
        gasTitle.className="detail-list-title";
        gasData.className="detail-list-data";
        gasBill.appendChild(gasTitle);
        gasBill.appendChild(gasData);
        const hr9= document.createElement('hr')
        //parking
        const parkingBill = document.createElement('div');
        parkingBill.className="paydetail-list";
        const parkingTitle = document.createElement('span');
        const parkingData = document.createElement('span');
        parkingTitle.textContent = "車位租金";
        parkingData.textContent = data[i].infoData.parking;
        parkingTitle.className="detail-list-title";
        parkingData.className="detail-list-data";
        parkingBill.appendChild(parkingTitle);
        parkingBill.appendChild(parkingData);
        const hr10= document.createElement('hr');
        //total
        const totalBill = document.createElement('div');
        totalBill.className="totalpaydetail-list";
        const totalTitle = document.createElement('span');
        const totalData = document.createElement('span');
        totalTitle.textContent = "總計";
        totalData.textContent = "$ " +data[i].totalPrice;
        totalTitle.className="detail-list-title";
        totalData.className="detail-list-data";
        totalBill.appendChild(totalTitle);
        totalBill.appendChild(totalData);
        //button
        const detailTwoBtn = document.createElement('div');
        detailTwoBtn.className = "detail-two-btn";
        const cancelBtn = document.createElement('button');
        cancelBtn.className = "red-btn";
        cancelBtn.textContent = "關閉視窗";
        cancelBtn.id = data[i].billId+"-cancel-btn";
        detailTwoBtn.appendChild(cancelBtn);    
        //sum
        detailDataBlock.appendChild(reserveTime);
        detailDataBlock.append(hr1);
        detailDataBlock.appendChild(rentBill);
        detailDataBlock.append(hr2);
        detailDataBlock.appendChild(waterBill);
        detailDataBlock.append(hr3);
        detailDataBlock.appendChild(electricBill);
        detailDataBlock.append(hr4);
        detailDataBlock.appendChild(manageBill);
        detailDataBlock.append(hr5);
        detailDataBlock.appendChild(cleanBill);
        detailDataBlock.append(hr6);
        detailDataBlock.appendChild(fourBill);
        detailDataBlock.append(hr7);
        detailDataBlock.appendChild(netBill);
        detailDataBlock.append(hr8);
        detailDataBlock.appendChild(gasBill);
        detailDataBlock.append(hr9);
        detailDataBlock.appendChild(parkingBill);
        detailDataBlock.append(hr10);
        detailDataBlock.appendChild(totalBill);
        detailDataBlock.appendChild(detailTwoBtn);
        reserveDetailBlock.appendChild(detailTitle);
        reserveDetailBlock.appendChild(detailDataBlock);
        sectionDetail.appendChild(reserveDetailBlock);
    }
}

function addListTitle(houseName,tanantName){
    document.getElementById('bill-house-name').textContent = houseName
    document.getElementById('bill-tanant-name').textContent = tanantName
}

function createLondloadBillList(data){
    const listScroll = document.getElementById('londloadpay-scroll')
    for (i=0;i<data.length;i++){
        const listItem = document.createElement('div');
        const listImgSpan = document.createElement('span');
        listImgSpan.className="paylist-minsize";
        const listImg = document.createElement('img');
        listImgSpan.appendChild(listImg);
        const listSetDateSpan = document.createElement('span');
        listSetDateSpan.className="paylist-minsize";
        listSetDateSpan.textContent=data[i].setDate;
        const listInfoBtnSpan = document.createElement('span');
        listInfoBtnSpan.className = "paylist-bigsize";
        const listInfoBtn = document.createElement('button');
        listInfoBtn.className = "priceinfo-btn";
        listInfoBtn.id=data[i].billId+"-detail-btn"
        listInfoBtn.textContent = "房租細項";
        listInfoBtn.addEventListener('click',clickDetailBtn)
        listInfoBtnSpan.appendChild(listInfoBtn)
        const listFixPriceSpan = document.createElement('span');
        listFixPriceSpan.className = "paylist-minsize";
        const listFixPriceBtn = document.createElement('button');
        if (data[i].status == "X"){
            listItem.className = "pay-no-block";
            listImg.src = "/public/images/x.png";
            listFixPriceBtn.className = "changeprice-btn";
            listFixPriceBtn.id=data[i].billId+"-fix-btn"
            listFixPriceBtn.textContent = "修改租金";
            listFixPriceBtn.addEventListener('click',clickFixBtn.bind(null,data[i]))
        } else {
            listItem.className = "pay-ok-block";
            listImg.src = "/public/images/o.png";
            listFixPriceBtn.className = "changeprice-no-btn";
            listFixPriceBtn.id=data[i].billId+"-nofix-btn"
            listFixPriceBtn.textContent = "不可修改";
        }  
        listFixPriceSpan.appendChild(listFixPriceBtn)
        const listTotal = document.createElement('span');
        listTotal.className = "paylist-minsize red-font";
        listTotal.textContent = '$ '+ data[i].totalPrice       
        const listPayDate = document.createElement('span');
        listPayDate.className = "paylist-minsize";
        listPayDate.textContent = data[i].payDate;
        listItem.appendChild(listImgSpan);
        listItem.appendChild(listSetDateSpan);
        listItem.appendChild(listInfoBtnSpan);
        listItem.appendChild(listFixPriceSpan);
        listItem.appendChild(listTotal);
        listItem.appendChild(listPayDate);
        listScroll.appendChild(listItem)
    }
}

function clickDetailBtn(){
    let detailId = this.id.split("-detail-btn")[0];
    const getBlock = document.getElementById(detailId+"-bill-detail");
    const grayBlock = document.getElementById('gray-block');
    const closeBtn = document.getElementById(detailId+"-close-btn");
    const detailCloseBtn = document.getElementById(detailId+"-cancel-btn");
    grayBlock.style.display="block";
    getBlock.style.display="block";
    document.body.classList.add('stop-scroll');
    closeBtn.addEventListener("click",()=>{
        grayBlock.style.display="none";
        getBlock.style.display="none";
        document.body.classList.remove('stop-scroll');
    })
    grayBlock.addEventListener('click',()=>{
        grayBlock.style.display="none";
        getBlock.style.display="none";
        document.body.classList.remove('stop-scroll');
    })
    detailCloseBtn.addEventListener('click',()=>{
        grayBlock.style.display="none";
        getBlock.style.display="none";
        document.body.classList.remove('stop-scroll');
    })
}

function clickFixBtn(data){
    const houseId = window.location.href.split('/')[window.location.href.split('/').length-1]
    location.replace('/londloadmember/pay/'+ houseId +'/fixbill/'+data.billId)
}