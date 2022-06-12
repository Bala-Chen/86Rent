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
            getValue()
        }
    })
};

function getValue(){
    const houseId = window.location.href.split('/')[window.location.href.split('/').length-1];
    document.getElementById('fix-href').href="/landlordmember/fixhouse/"+houseId
    fetch('/landlordApi/house?houseId='+houseId)
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        //person
        document.getElementById('responsible-person').value = resJson.data.contactPerson
        document.getElementById('responsible-person-firstname').value = resJson.data.firstName
        if (resJson.data.gerder == "先生"){
            document.getElementById('gentlemen').checked = true
        } else {
            document.getElementById('lady').checked = true
        }
        document.getElementById('responsible-phone').value = resJson.data.phone;
        document.getElementById('responsible-email').value = resJson.data.email;
        //houseinfo
        document.getElementById('house-title').value = resJson.data.houseTitle;
        for (i=1;i<15;i++){
            if ((resJson.data.houseTag).includes(String(i))){
                document.getElementById('housetag'+i).checked = true
            }
        }
        document.getElementById('select-house-city').value = resJson.data.city;
        document.getElementById('new-house-address').value = resJson.data.address;
        if (resJson.data.building == 1){
            document.getElementById('apartment').checked = true;
        } else if (resJson.data.building == 2){
            document.getElementById('villa').checked = true;
        } else if (resJson.data.building == 3){
            document.getElementById('mansion').checked = true;
        } else if (resJson.data.building == 4){
            document.getElementById('elevator-building').checked = true;
        }
        if (resJson.data.roomType == 1){
            document.getElementById('all-floor').checked = true;
        } else if (resJson.data.roomType == 2){
            document.getElementById('independent-suite').checked = true;
        } else if (resJson.data.roomType == 3){
            document.getElementById('sublet-suite').checked = true;
        } else if (resJson.data.roomType == 4){
            document.getElementById('room').checked = true;
        } else if (resJson.data.roomType == 5){
            document.getElementById('parking-space').checked = true;
        }
        document.getElementById('ping-number').value = resJson.data.pingNumber;
        document.getElementById('house-floor').value = resJson.data.houseFloor;
        document.getElementById('room-num').value = resJson.data.roomNum;
        document.getElementById('livingroom-num').value = resJson.data.livingroomNum;
        document.getElementById('bathroom-num').value = resJson.data.bathroomNum;
        document.getElementById('rent-price').value = resJson.data.rentPrice;
        if (resJson.data.deposit == 1){
            document.getElementById('no-house-deposit').checked = true;
        } else if (resJson.data.deposit == 2){
            document.getElementById('yes-house-deposit').checked = true;
            document.getElementById('rent-month').value = resJson.data.depositMonth;
            document.getElementById('rent-month').removeAttribute("disabled")
            document.getElementById('rent-money').value = resJson.data.depositPrice;
            document.getElementById('rent-money').removeAttribute("disabled")
        }
        if (resJson.data.managementFee == 1){
            document.getElementById('no-management-fee').checked = true;
        } else if (resJson.data.managementFee == 2){
            document.getElementById('yes-management-fee').checked = true;
            document.getElementById('management-price').value = resJson.data.managementPrice;
            document.getElementById('management-price').removeAttribute("disabled")
        }
        //equipment
        document.getElementById('select-identity').value = resJson.data.shortestMonth;
        if (resJson.data.cooking == 1){
            document.getElementById('no-cooking').checked = true;
        } else if(resJson.data.cooking == 2){
            document.getElementById('ok-cooking').checked = true;
        }
        if (resJson.data.pet == 1){
            document.getElementById('no-pet').checked = true;
        } else if(resJson.data.pet == 2){
            document.getElementById('ok-pet').checked = true;
        }
        if (resJson.data.rentLimit == 1){
            document.getElementById('rent-limit-0').checked = true;
        } else if (resJson.data.rentLimit == 2){
            document.getElementById('rent-limit-1').checked = true;
        } else if (resJson.data.rentLimit == 3){
            document.getElementById('rent-limit-2').checked = true;
        } else if (resJson.data.rentLimit == 4){
            document.getElementById('rent-limit-3').checked = true;
        } else if (resJson.data.rentLimit == 5){
            document.getElementById('other-rent-limit').checked = true;
            document.getElementById('rent-limit').value = resJson.data.rentotherLimit;
            document.getElementById('rent-limit').removeAttribute("disabled");
        }
        for (i=1;i<16;i++){
            if ((resJson.data.furnitureTag).includes(String(i))){
                document.getElementById('furnituretag'+i).checked = true
            }
        }
        for (i=1;i<9;i++){
            if ((resJson.data.rentTag).includes(String(i))){
                document.getElementById('renttag'+i).checked = true
            }
        }
        if (resJson.data.houseRights == 1){
            document.getElementById('no-rights').checked = true;
        } else if(resJson.data.houseRights == 2){
            document.getElementById('ok-rights').checked = true;
        }
        document.getElementById('house-direction').value = resJson.data.houseDirection;
        document.getElementById('house-use').value = resJson.data.houseUse;
        document.getElementById('house-area').value = resJson.data.houseArea;
        document.getElementById('remark').value = resJson.data.remark;
    })
}

function updateValue(e){
    e.preventDefault();
    document.getElementById('form-submit').setAttribute("disabled","disabled");
    setTimeout(()=>{
        document.getElementById('form-submit').removeAttribute("disabled")
    },2000)
    const houseID = window.location.href.split('/')[window.location.href.split('/').length-1];
    const gender = radioValue('gender');
    const houseTag = checkBoxValue('housetag')
    const buildingType = radioValue('buildingType');;
    const roomType = radioValue('roomType');
    const houseDeposit = radioValue('houseDeposit');
    const managementFee = radioValue('managementFee');
    const cooking = radioValue('cooking') ;
    const pet = radioValue('pet');
    const rentLimit = radioValue('rentLimit');
    const furnitureTag = checkBoxValue('furnituretag');
    const rentTag = checkBoxValue('renttag')
    const houseRights = radioValue('houseRights');

    const data = {
        responsiblePerson:document.getElementById('responsible-person').value,
        firstName:document.getElementById('responsible-person-firstname').value,
        gender:gender,
        cellphone:document.getElementById('responsible-phone').value,
        newHouseEmail:document.getElementById('responsible-email').value,
        houseTitleName:document.getElementById('house-title').value,
        houseTag: houseTag,
        selectHouseCity:document.getElementById('select-house-city').value,
        newHouseAddress:document.getElementById('new-house-address').value,
        buildingType:buildingType,
        roomType:roomType,
        pingNumber:document.getElementById('ping-number').value,
        houseFloor:document.getElementById('house-floor').value,
        roomNum:document.getElementById('room-num').value,
        livingroomNum:document.getElementById('livingroom-num').value,
        bathroomNum:document.getElementById('bathroom-num').value,
        rentPrice:document.getElementById('rent-price').value,
        houseDeposit:houseDeposit,
        rentMonth:document.getElementById('rent-month').value,
        rentMoney:document.getElementById('rent-money').value,
        managementFee:managementFee,
        managementPrice:document.getElementById('management-price').value,
        rentYear:document.getElementById('select-identity').value,
        cooking:cooking,
        pet:pet,
        rentLimit:rentLimit,
        otherLimit:document.getElementById('rent-limit').value,
        furnituretag:furnitureTag,
        renttag:rentTag,
        houseRights:houseRights,
        houseDirection:document.getElementById('house-direction').value,
        conditions:document.getElementById('house-use').value,
        houseArea:document.getElementById('house-area').value,
        commentArea:document.getElementById('remark').value
    }
    fetch('/landlordApi/house',{
        method:'PUT',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({houseId:houseID,data:data})
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.ok){
            const msg = document.getElementById('fixhouse-success-msg');
            const grayBlock = document.getElementById('gray-block');
            msg.style.display = 'flex';
            grayBlock.style.display = 'block';
            document.getElementById('go-member-btn').addEventListener('click',()=>{
                location.replace('/landlordmember')
            })
            document.getElementById('go-houseinfo-btn').addEventListener('click',()=>{
                location.replace('/houseinfo/'+houseID)
            })
        }
    })
}

function radioValue(idName){
    let originValues = document.getElementsByName(idName);
    let value;
    for(i=0;i<originValues.length;i++){
        if(originValues[i].checked){
            value = originValues[i].value
        }
    }
    return value
}

function checkBoxValue(idName){
    let originValues = document.getElementsByName(idName);
    let arr = [];
    for(i=0;i<originValues.length;i++){
        if(originValues[i].checked){
            arr.push(originValues[i].value)
        }
    }
    return arr
}

//check-box limit
const checkboxs = document.getElementsByName('housetag');
const limit = 5;

for (i=0; i<checkboxs.length; i++){
    checkboxs[i].onclick = checkLimit;
}

function checkLimit(e){
    let checkboxChecked = document.querySelectorAll(".check:checked")
    if (checkboxChecked.length >= limit + 1){
        return false
    }
}

//checkbox=yes other input
//deposit
const noDepositRadio = document.getElementById('no-house-deposit');
const yesDepositRadio = document.getElementById('yes-house-deposit');
const rentMonthSelect = document.getElementById('rent-month');
const rentPrice = document.getElementById('rent-money');

noDepositRadio.addEventListener("click",()=>{
    rentMonthSelect.value="0";
    rentMonthSelect.setAttribute("disabled","disabled");
    rentPrice.value = "";
    rentPrice.setAttribute("disabled","disabled");
})

yesDepositRadio.addEventListener("click",()=>{
    rentMonthSelect.removeAttribute("disabled");
    rentPrice.removeAttribute('disabled');
})

//management-fee
const noManagementFee = document.getElementById('no-management-fee');
const yesManagementFee = document.getElementById('yes-management-fee');
const managementPrice = document.getElementById('management-price');

noManagementFee.addEventListener("click",()=>{
    managementPrice.value = "";
    managementPrice.setAttribute("disabled","disabled");
})

yesManagementFee.addEventListener("click",()=>{
    managementPrice.removeAttribute("disabled");
})

//rent-limit
const otherRentLimit = document.getElementById('other-rent-limit');
const rentLimitInput = document.getElementById('rent-limit');

otherRentLimit.addEventListener('click',()=>{
    rentLimitInput.removeAttribute("disabled");
})

for(i=0;i<4;i++){
    document.getElementById('rent-limit-'+i).addEventListener("click",()=>{
        rentLimitInput.value = "";
        rentLimitInput.setAttribute("disabled","disabled");
    })
}