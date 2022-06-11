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
            getTotalPrice()
            getPriceValue()
        } 
    })
};

function getPriceValue(){
    if (window.location.href.includes('addbill')){
        const houseId = window.location.href.split('/')[window.location.href.split('/').length-2] 
        document.getElementById('go-paylist-btn').href = "/landlordmember/pay/"+houseId;
        fetch('/landlordApi/bill?houseId='+houseId)
        .then((res)=>{
            return res.json();
        })
        .then((resJson)=>{
            document.getElementById('rent-price').value = resJson.price.rent;
            document.getElementById('total-money').textContent = resJson.price.rent;
        })
    } else if (window.location.href.includes('fixbill')){
        const billId = window.location.href.split('/')[window.location.href.split('/').length-1]
        const houseId = window.location.href.split('/')[window.location.href.split('/').length-3]
        document.getElementById('go-paylist-btn').href = "/landlordmember/pay/"+houseId;
        document.getElementById('go-fixbill-btn').href = "/landlordmember/pay/"+houseId+"/fixbill/"+billId;
        fetch('/landlordApi/bill?houseId='+houseId+'&billId='+billId)
        .then((res)=>{
            return res.json();
        })
        .then((resJson)=>{
            document.getElementById('rent-price').value = resJson.price.rent;
            document.getElementById('water-price').value = resJson.price.water;
            document.getElementById('electric-price').value = resJson.price.electric;
            document.getElementById('manage-price').value = resJson.price.manage
            document.getElementById('clean-price').value = resJson.price.clean;
            document.getElementById('four-price').value = resJson.price.four;
            document.getElementById('net-price').value = resJson.price.net; 
            document.getElementById('gas-price').value = resJson.price.gas;
            document.getElementById('parking-price').value = resJson.price.parking;
            document.getElementById('total-money').textContent = resJson.price.total;
        })
    }
}

function getTotalPrice(){
    const totalMoney = document.getElementById('total-money');
    totalMoney.textContent = parseInt(document.getElementById('rent-price').value)
    document.getElementById('rent-price').addEventListener('change',sumPrice)
    document.getElementById('water-price').addEventListener('change',sumPrice)
    document.getElementById('electric-price').addEventListener('change',sumPrice)
    document.getElementById('manage-price').addEventListener('change',sumPrice)
    document.getElementById('clean-price').addEventListener('change',sumPrice)
    document.getElementById('four-price').addEventListener('change',sumPrice)
    document.getElementById('net-price').addEventListener('change',sumPrice)
    document.getElementById('gas-price').addEventListener('change',sumPrice)
    document.getElementById('parking-price').addEventListener('change',sumPrice)
}

function sumPrice(){
    const rentPrice = parseInt(document.getElementById('rent-price').value);
    const waterPrice = parseInt(document.getElementById('water-price').value);
    const electricPrice = parseInt(document.getElementById('electric-price').value);
    const managePrice = parseInt(document.getElementById('manage-price').value);
    const cleanPrice = parseInt(document.getElementById('clean-price').value);
    const fourPrice = parseInt(document.getElementById('four-price').value);
    const netPrice = parseInt(document.getElementById('net-price').value);
    const gasPrice = parseInt(document.getElementById('gas-price').value);
    const parkingPrice = parseInt(document.getElementById('parking-price').value);
    const totalMoney = document.getElementById('total-money');
    totalMoney.textContent = rentPrice+waterPrice+electricPrice+managePrice+cleanPrice+fourPrice+netPrice+gasPrice+parkingPrice;
}

function getPrice(e){
    e.preventDefault();
    const rentPrice = parseInt(document.getElementById('rent-price').value);
    const waterPrice = parseInt(document.getElementById('water-price').value);
    const electricPrice = parseInt(document.getElementById('electric-price').value);
    const managePrice = parseInt(document.getElementById('manage-price').value);
    const cleanPrice = parseInt(document.getElementById('clean-price').value);
    const fourPrice = parseInt(document.getElementById('four-price').value);
    const netPrice = parseInt(document.getElementById('net-price').value);
    const gasPrice = parseInt(document.getElementById('gas-price').value);
    const parkingPrice = parseInt(document.getElementById('parking-price').value);
    const totalMoney = parseInt(document.getElementById('total-money').textContent);
    if (window.location.href.includes('addbill')){
        const houseId = window.location.href.split('/')[window.location.href.split('/').length-2]
        fetch('/landlordApi/bill',{
            method:'POST',
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({houseID:houseId,rentPrice:rentPrice,waterPrice:waterPrice,electricPrice:electricPrice,managePrice:managePrice,cleanPrice:cleanPrice,fourPrice:fourPrice,netPrice:netPrice,gasPrice:gasPrice,parkingPrice:parkingPrice,totalMoney:totalMoney})
        })
        .then((res)=>{
            return res.json()
        })
        .then((resJson)=>{
            if (resJson.ok){
                location.replace('/landlordmember/pay/'+houseId)
            }
        })
    } else if (window.location.href.includes('fixbill')){
        const billId = window.location.href.split('/')[window.location.href.split('/').length-1]
        const houseId = window.location.href.split('/')[window.location.href.split('/').length-3]
        fetch('/landlordApi/bill',{
            method:'PUT',
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({houseID:houseId,billID:billId,rentPrice:rentPrice,waterPrice:waterPrice,electricPrice:electricPrice,managePrice:managePrice,cleanPrice:cleanPrice,fourPrice:fourPrice,netPrice:netPrice,gasPrice:gasPrice,parkingPrice:parkingPrice,totalMoney:totalMoney})
        })
        .then((res)=>{
            return res.json()
        })
        .then((resJson)=>{
            if (resJson.ok){
                location.replace('/landlordmember/pay/'+houseId)
            }
        })
    }
}