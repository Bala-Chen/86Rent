const url = window.location.href;
const urlFinal = url.split('/')[url.split('/').length-1]
getUserStatus()

if (urlFinal=="landlord"){
    const landlordForm = document.getElementById("landlord-register-form");
    landlordForm.addEventListener("submit",(e)=>{
        e.preventDefault();
 
        submitData("landlord")
    })
} else if(urlFinal=="tenant"){
    const tenantForm = document.getElementById("tenant-register-form");
    tenantForm.addEventListener("submit",(e)=>{
        e.preventDefault();
 
        submitData("tenant")
    })
} else if(urlFinal=="signin"){
    const signinForm = document.getElementById("signin-form");
    signinForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        submitSignin();
    })
} else{
    const signoutBtn = document.getElementById('signout-btn');
    signoutBtn.addEventListener("click",signoutMember)
}

function submitData(identity){
    const email = document.getElementById(identity+"-email").value;
    const pwd = document.getElementById(identity+"-pwd").value;
    const pwdCheck = document.getElementById(identity+"-pwd-check").value;
    const firstName = document.getElementById(identity+"-firstname").value;
    const lastName = document.getElementById(identity+"-lastname").value;
    let genderResuit;
    const gender = document.getElementsByName(identity+"-gender");
    for (i=0;i<gender.length;i++){
        if(gender[i].checked){
            genderResuit = gender[i].value;
        }
    }
    const cellphone = document.getElementById(identity+"-cellphone").value;
    const captcha = document.querySelector('#g-recaptcha-response').value;
    if (pwd == pwdCheck){
        fetch('/api/member',{
            method:'POST',
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({email:email,password:pwd,allname:firstName+lastName,gender:genderResuit,cellphone:cellphone,captcha:captcha})
        })
        .then((res)=>{
            return res.json()
        })
        .then((resJson)=>{
            if (resJson.ok){
                location.replace('/')
            } else {
                addErrorBlock(resJson.msg,identity)
                grecaptcha.reset();
            }
        })
    } else {
        addErrorBlock("密碼驗證輸入有誤，請重新再試",identity)
    }
}

function submitSignin(){
    const signinEmail = document.getElementById('signin-email').value;
    const signinPwd = document.getElementById('signin-pwd').value;
    fetch('/api/member',{
        method:'PATCH',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({email:signinEmail,password:signinPwd})
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.ok){
            location.replace('/')
        } else {
            addErrorBlock(resJson.msg,"signin")
        }
    })
}

function signoutMember(){
    fetch('/api/member',{
        method:'DELETE'
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

function getUserStatus(){
    fetch('/api/member',{
        method:'GET'
    })
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        const registerBtn = document.getElementById('register-btn');
        const signinBtn = document.getElementById('signin-btn');
        const signoutBtn = document.getElementById('signout-btn');
        const memberpageBtn = document.getElementById('memberpage-btn');
        if (resJson.data != null){
            //登入狀態
            if(urlFinal=="" | url.includes('houseinfo')| url.includes('search')){
                registerBtn.style.display = "none";
                signinBtn.style.display = "none";
                signoutBtn.style.display = "block";
                memberpageBtn.style.display = "block";
                memberpageBtn.addEventListener("click",()=>{
                    const id = resJson.data.id;
                    if(id.slice(0,1)=="T"){
                        location.replace('/tenantmember')
                    } else if(id.slice(0,1)=="L"){
                        location.replace('/landlordmember')
                    }
                })
                if (url.includes('houseinfo')){
                    const updateReserveForm = document.getElementById('update-reserve-form')
                    const reservationForm = document.getElementById('reservation-form');
                    const registerMessage = document.getElementById('register-message');
                    if (resJson.data.id[0]=="T"){
                        updateReserveForm.style.display="none";
                        reservationForm.style.display="none";
                        registerMessage.style.display="none";
                    } else {
                        updateReserveForm.style.display="none";
                        reservationForm.style.display="none";
                        registerMessage.style.display="block";
                        document.getElementById('check-register-btn').addEventListener('click',()=>{
                            location.replace('/registerch/tenant')
                        })
                    }
                } 
            } else if (url.includes('signin')){
                location.replace('/')
            }
        } else {
            //登出狀態
            if (!url.includes('registerch') && !url.includes('signin')){
                signoutBtn.style.display = "none";
                memberpageBtn.style.display = "none";
                registerBtn.style.display = "block";
                signinBtn.style.display = "block";
            }
            if (url.includes('houseinfo')){
                const updateReserveForm = document.getElementById('update-reserve-form')
                const reservationForm = document.getElementById('reservation-form');
                const registerMessage = document.getElementById('register-message');
                updateReserveForm.style.display="none";
                reservationForm.style.display="none";
                registerMessage.style.display="block";
                document.getElementById('check-register-btn').addEventListener('click',()=>{
                    location.replace('/registerch/tenant')
                })
            }
        }
    })
}


function addErrorBlock(resMsg,identity){
    const errblock = document.getElementById(identity+"-error-msg");
    const errtext = document.createElement("p");
    errtext.textContent=resMsg;
    errblock.textContent="";
    errblock.appendChild(errtext);
}