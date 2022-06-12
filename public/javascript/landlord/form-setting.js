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

//add-imgs
for (i=1;i<=5;i++){
    const addImgBtn = document.getElementById('upload_input'+i);
    addImgBtn.addEventListener("change",readIMG)
}

function readIMG(e){
    const getId = this.id;
    const file = this.files[0];
    const fr = new FileReader();
    fr.onload = (e)=>{
        const spanP = document.getElementById("upload-p"+getId.substr(-1));
        const addImg = document.getElementById('upload-img'+getId.substr(-1));
        addImg.src = e.target.result;
        spanP.style.display="none"
    }
    fr.readAsDataURL(file)
}

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
        }
    })
};

function updateValue(e){
    e.preventDefault();
    document.getElementById('form-submit').setAttribute("disabled","disabled");
    setTimeout(()=>{
        document.getElementById('form-submit').removeAttribute("disabled")
    },5000)
    const formValues = document.querySelector('form')
    const formData = new FormData(formValues);
    fetch('/landlordApi/house',{
        method:'POST',
        body:formData
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.ok){
            const msg = document.getElementById('addhouse-success-msg');
            const grayBlock = document.getElementById('gray-block');
            msg.style.display = 'flex';
            grayBlock.style.display = 'block';
            document.getElementById('go-member-btn').addEventListener('click',()=>{
                location.replace('/landlordmember')
            })
            document.getElementById('go-houseinfo-btn').addEventListener('click',()=>{
                location.replace('/houseinfo/'+resJson.houseId)
            })
        } else {
            document.getElementById('err-msg').textContent = resJson.msg;
        }
    })
}
