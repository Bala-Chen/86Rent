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
            getBillData()
        }
    })
};

function getBillData(){
    const billId = window.location.href.split('/')[window.location.href.split('/').length-1]
    const houseId = window.location.href.split('/')[window.location.href.split('/').length-2]
    fetch('/tenantApi/payBill/'+billId)
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.billData == null){
            const main = document.getElementById("main")
            main.innerHTML=""
        } else {
            const payListBtn = document.getElementById('go-paylist-btn');
            payListBtn.href = "/tenantmember/pay/"+ houseId;
            const payPageBtn = document.getElementById('pay-page-btn');
            payPageBtn.href = "/tenantmember/pay/"+ houseId +"/"+ billId;
            document.getElementById('gray-back-btn').addEventListener('click',()=>{
                location.replace("/tenantmember/pay/"+ houseId)
            })
            createBillDetail(resJson.billData)
            document.getElementById('paypage-price').textContent = "$ "+resJson.billData.totalPrice;
            document.getElementById('priceinfo-btn').addEventListener('click',()=>{
                const getBlock = document.getElementById("paydetail-bill-detail");
                const grayBlock = document.getElementById('gray-block');
                const closeBtn = document.getElementById("paydetail-close-btn");
                const detailCloseBtn = document.getElementById("red-cancel-btn");
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
            })
        }
    }) 
}

function createBillDetail(data){
    const sectionDetail = document.getElementById('section-detail');
    const reserveDetailBlock = document.createElement('div');
    reserveDetailBlock.className="reserve-detail-block";
    reserveDetailBlock.id="paydetail-bill-detail"
    const detailTitle = document.createElement('div');
    detailTitle.className = "detail-title";
    const detailTitleH3 = document.createElement('h3');
    detailTitleH3.textContent = "房租細項";
    const detailImgBtn = document.createElement('button');
    const detailImg = document.createElement('img');
    detailImgBtn.id = "paydetail-close-btn"
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
    timeData.textContent = data.setDate;
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
    rentData.textContent = data.rent;
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
    waterData.textContent = data.water;
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
    electricData.textContent = data.electric;
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
    manageData.textContent = data.manage;
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
    cleanData.textContent = data.clean;
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
    fourData.textContent = data.four;
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
    netData.textContent = data.net;
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
    gasData.textContent = data.gas;
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
    parkingData.textContent = data.parking;
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
    totalData.textContent = "$ " +data.totalPrice;
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
    cancelBtn.id = "red-cancel-btn";
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

//tappay
TPDirect.setupSDK(123965,'app_NZdIqFBF7UBPGClOer5Nt4ZinS3qCQKtYO6lC5lNcOIJYb7ZE6VhfrhkpjbE', 'sandbox');
TPDirect.card.setup({
    fields: {
        number: {
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: '#card-expiration-date',
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'CVV'
        }
    },
    styles: {
        'input': {
            'color': 'gray',
            'font-size': '16px'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        ':focus': {
            'color': '#666666'
        },
        '.valid': {
            'color': '#269A85'
        },
        '.invalid': {
            'color': '#CD4848'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

const paySubmit = document.getElementById('pay-submit')
TPDirect.card.onUpdate(function (update) {
    if (update.canGetPrime) {
        paySubmit.removeAttribute('disabled')
    } else {
        paySubmit.setAttribute('disabled', true)
    }
})

paySubmit.addEventListener("click",onSubmit)
function onSubmit(e) {
    e.preventDefault();
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    const payErr = document.getElementById('pay-err-msg');

    if (tappayStatus.canGetPrime === false) {
        payErr.textContent = '無法正確送出資料';
        return
    }

    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            cardErr.textContent ='取得prime error原因' + result.msg;
            return
        }
        
        const prime = result.card.prime;
        const totalPrice = document.getElementById('paypage-price').textContent.split(' ')[1];
        const cardName = document.getElementById('card-user').value;
        const billId = window.location.href.split('/')[window.location.href.split('/').length-1]
        const houseId = window.location.href.split('/')[window.location.href.split('/').length-2]
        paySubmit.setAttribute("disabled","disabled")
        setTimeout(()=>{
            paySubmit.removeAttribute("disabled")
        },1000)
        fetch('/tenantApi/payBill',{
            method:'POST',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({prime:prime,billId:billId,cardName:cardName,totalPrice:totalPrice,houseId:houseId})
        })
        .then((res)=>{
            return res.json()
        })
        .then((resJson)=>{
            const grayBlock = document.getElementById('gray-block')
            if (resJson.ok == true){
                const paySuccessMsg = document.getElementById('pay-success-msg');
                const backMember = document.getElementById('back-member');
                const houseId = window.location.href.split('/')[window.location.href.split('/').length-2] 
                grayBlock.style.display = "block";
                paySuccessMsg.style.display = "flex";
                backMember.addEventListener('click',()=>{
                    location.replace('/tenantmember/pay/'+houseId)
                })
            } else {
                const payFailMsg = document.getElementById('pay-fail-msg');
                const backPaylist = document.getElementById('back-paylist');
                const houseId = window.location.href.split('/')[window.location.href.split('/').length-2] 
                grayBlock.style.display = "block";
                payFailMsg.style.display = "flex";
                backPaylist.addEventListener('click',()=>{
                    location.replace('/tenantmember/pay/'+houseId)
                })
            }
        })
    })
}