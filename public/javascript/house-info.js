const houseID = (window.location.href).split('/')[url.split('/').length-1];

function showHouseInfo(){
    fetch('/api/houseinfo/'+houseID)
    .then((res)=>{
        return res.json()
    })
    .then((resJson)=>{
        if (resJson.data == null){
            const main = document.getElementById("main")
            main.innerHTML=""
        } else {
            topLeftImg(resJson.data.basicInfo)
            topRightInfo(resJson.data.basicInfo)
            equipmentBlock(resJson.data.equipment)
            detailBlock(resJson.data)
            createRemark(resJson.data.detail.remark)
            if (resJson.tanantName){
                const updateReserveForm = document.getElementById('update-reserve-form')
                const reservationForm = document.getElementById('reservation-form');
                if(resJson.reserve != null){
                    //有預約過
                    updateReserveForm.style.display = "block";
                    reservationForm.style.display="none";
                    document.getElementById('update-datetime-local').value = resJson.reserve.reserveDate+"T"+resJson.reserve.reserveTime;
                    document.getElementById('update-member-phone').value = resJson.reserve.reservePhone;
                    document.getElementById('update-other-question').value = resJson.reserve.otherQuestion;
                    updateReserve()
                } else {
                    //沒預約過
                    updateReserveForm.style.display = "none";
                    reservationForm.style.display="block";
                    document.getElementById('member-name').value = resJson.tanantName;
                    insertReserve()
                }
            }
        }
    })
}

showHouseInfo()

function topLeftImg(data){
    const houseImgsGroup = document.getElementById('house-imgs-group');
    let lunbos = document.createElement('div');
    lunbos.className = 'lunbos';
    for (i = 0; i < data.img.length; i++){
        let imgItem = document.createElement("div");
        let imgSrc = document.createElement("img");
        let lunboCircle = document.createElement("span");
        imgItem.className = "img-item";
        imgSrc.src = data.img[i];
        lunboCircle.className = "lunbo-circle";
        lunbos.appendChild(lunboCircle);
        imgItem.appendChild(imgSrc);
        houseImgsGroup.appendChild(imgItem);
    }
    let prev = document.createElement('a');
    let prevArrow = document.createElement('img');
    let next = document.createElement('a');
    let nextArrow = document.createElement('img');
    prev.className = 'prev-arrow';
    prevArrow.src = '/public/images/btn_leftArrow.png';
    next.className = 'next-arrow';
    nextArrow.src = '/public/images/btn_rightArrow.png';
    prev.appendChild(prevArrow);
    next.appendChild(nextArrow);
    houseImgsGroup.appendChild(lunbos);
    houseImgsGroup.appendChild(prev);
    houseImgsGroup.appendChild(next);
    if (data.img.length==1){
        prev.style.display = "none";
        next.style.display = "none";
    }
    currentSlide(1)
    prev.addEventListener("click",previousSlide);
    next.addEventListener("click",nextSlide);
}

function topRightInfo(data){
    const houseToprightInfo = document.getElementById('house-topright-info');
    const houseH2 = document.createElement('h2');
    houseH2.textContent = data.houseName;
    const houseTagUl = document.createElement('ul');
    for (i=0;i<data.tag.length;i++){
        const houseTagli = document.createElement('li');
        houseTagli.textContent = data.tag[i]
        houseTagUl.appendChild(houseTagli)
    };
    const houseH4 = document.createElement('h4');
    houseH4.textContent = data.roomName +' ｜ ' +data.pingNum+'坪 ｜ '+data.houseFloor+'F';
    const houseP = document.createElement('p');
    const houseIconImg = document.createElement('img');
    houseIconImg.src = '/public/images/home.png';
    const addressSpan = document.createElement('span');
    addressSpan.textContent = data.houseAddress;
    houseP.appendChild(houseIconImg);
    houseP.appendChild(addressSpan)
    const pattrenP = document.createElement('p');
    const pattrenIconImg = document.createElement('img');
    pattrenIconImg.src = '/public/images/room-sum.PNG';
    const pattrenSpan = document.createElement('span');
    pattrenSpan.textContent = data.housePattren;
    pattrenP.appendChild(pattrenIconImg);
    pattrenP.appendChild(pattrenSpan);
    const housePriceArea = document.createElement('div');
    housePriceArea.className ="house-price-area";
    const priceH3 = document.createElement('h3');
    priceH3.textContent=data.rentPrice;
    const unit = document.createElement('span');
    unit.className="unit";
    unit.textContent="元/月"
    const depositMonth = document.createElement('span');
    depositMonth.className = "deposit-month";
    depositMonth.textContent = "押金"+data.depositMonth;
    housePriceArea.appendChild(priceH3);
    housePriceArea.appendChild(unit);
    housePriceArea.appendChild(depositMonth);
    const londloadInfo = document.createElement('div');
    londloadInfo.className = "londload-info";
    const londloadName = document.createElement('div');
    londloadName.className = "londload-name";
    const personIcon = document.createElement('img');
    personIcon.src="/public/images/member icon.png";
    const houseUser = document.createElement('h4');
    houseUser.textContent = data.contactName +" "+data.callName;
    londloadName.appendChild(personIcon);
    londloadName.appendChild(houseUser);
    const londloadPhoneNumber = document.createElement('div');
    londloadPhoneNumber.className="londload-phonenumber";
    const phoneIcon = document.createElement('img');
    phoneIcon.src="/public/images/phone_icon.png";
    const phoneNumber = document.createElement('h4');
    phoneNumber.textContent = data.contactCellphone;
    londloadPhoneNumber.appendChild(phoneIcon);
    londloadPhoneNumber.appendChild(phoneNumber);
    londloadInfo.appendChild(londloadName);
    londloadInfo.appendChild(londloadPhoneNumber);
    houseToprightInfo.appendChild(houseH2);
    houseToprightInfo.appendChild(houseTagUl);
    houseToprightInfo.appendChild(houseH4);
    houseToprightInfo.appendChild(houseP);
    houseToprightInfo.appendChild(pattrenP);
    houseToprightInfo.appendChild(housePriceArea);
    houseToprightInfo.appendChild(londloadInfo)
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function nextSlide() {
    showSlides(slideIndex += 1);
}

function previousSlide() {
    showSlides(slideIndex -= 1);  
}

function showSlides(n){
    let slides = document.getElementsByClassName('img-item');
    let lunboS = document.getElementsByClassName('lunbo-circle');
    if (n > slides.length){
        slideIndex = 1;
    }

    if (n < 1){
        slideIndex = slides.length;
    }

    for (let slide of slides){
        slide.style.display = "none";
    }
    for (let lunboCir of lunboS){
        lunboCir.classList.remove("hover");
    }

    slides[slideIndex - 1].style.display = "block";
    lunboS[slideIndex - 1].classList.add("hover");
}

function equipmentBlock(data){
    const equipmentInfo = document.getElementById('equipment-block');
    const equipmentTitle = document.createElement('h2');
    equipmentTitle.textContent = "設備與服務";
    const leftRight = document.createElement('left-and-right');
    leftRight.className = "left-and-right";
    const leftService = document.createElement('div');
    leftService.className = "left-service";
    const rentInstruction = document.createElement('div');
    rentInstruction.className="rent-instruction";
    const smallTitle = document.createElement('div');
    smallTitle.className = "small-title";
    const calenderIcon = document.createElement('img');
    calenderIcon.src="/public/images/calendar.png";
    const smallTitleH4 = document.createElement('h4');
    smallTitleH4.textContent ="租住說明";
    smallTitle.appendChild(calenderIcon);
    smallTitle.appendChild(smallTitleH4);
    const depositP = document.createElement('p');
    if (data.shortestTime >= 12){
        depositP.textContent = "最短租期 "+Number(data.shortestTime)/12+" 年";
    } else {
        depositP.textContent = "最短租期 "+data.shortestTime+" 個月";
    }
    rentInstruction.appendChild(smallTitle);
    rentInstruction.appendChild(depositP);
    const houseLimit = document.createElement('div');
    houseLimit.className="house-limit";
    const smallTitle2 = document.createElement('div');
    smallTitle2.className = "small-title";
    const bookmarkIcon = document.createElement('img');
    bookmarkIcon.src="/public/images/foundation_book-bookmark.png";
    const smallTitleH42 = document.createElement('h4');
    smallTitleH42.textContent ="房屋守則";
    smallTitle2.appendChild(bookmarkIcon);
    smallTitle2.appendChild(smallTitleH42);
    const limitP = document.createElement('p');
    if (data.limitName == "無"){
        limitP.textContent = "此房屋不限房客類型，"+data.pet+"，"+data.cooking;
    } else if (data.limitName != "無" && data.limitName != "其他"){
        limitP.textContent = "此房屋"+ data.limitName +"，"+data.pet+"，"+data.cooking;
    } else if (data.limitName == "其他"){
        limitP.textContent = "此房屋"+ data.otherLimit +"，"+data.pet+"，"+data.cooking;
    }   
    houseLimit.appendChild(smallTitle2);
    houseLimit.appendChild(limitP)
    leftService.appendChild(rentInstruction);
    leftService.appendChild(houseLimit);
    //right
    const rightService = document.createElement('div');
    rightService.className = "right-service";
    const smallTitleRight = document.createElement('div');
    smallTitleRight.className = "small-title";
    const checkIcon = document.createElement('img');
    checkIcon.src="/public/images/ph_house-simple-fill.png";
    const smallTitleRightH4 = document.createElement('h4');
    smallTitleRightH4.textContent ="提供設備";
    smallTitleRight.appendChild(checkIcon);
    smallTitleRight.appendChild(smallTitleRightH4);
    //equipment list
    const equipmentList = document.createElement('div');
    equipmentList.className = "equirment-list";
    //span1
    const equipmentSpan1 = document.createElement('span');
    if (!data.furnitureName.includes("冰箱")){
        equipmentSpan1.className="del"
    }
    const equipmentImg1 = document.createElement('img');
    equipmentImg1.src = "/public/images/equipment_icon/icon_ref.png"
    const equipment1 = document.createElement('h6');
    equipment1.textContent = "冰箱";
    equipmentSpan1.appendChild(equipmentImg1);
    equipmentSpan1.appendChild(equipment1);
    equipmentList.appendChild(equipmentSpan1);
    //span2
    const equipmentSpan2 = document.createElement('span');
    if (!data.furnitureName.includes("洗衣機")){
        equipmentSpan2.className="del"
    }
    const equipmentImg2 = document.createElement('img');
    equipmentImg2.src = "/public/images/equipment_icon/icon_wash.png"
    const equipment2 = document.createElement('h6');
    equipment2.textContent = "洗衣機";
    equipmentSpan2.appendChild(equipmentImg2);
    equipmentSpan2.appendChild(equipment2);
    equipmentList.appendChild(equipmentSpan2);
    //span3
    const equipmentSpan3 = document.createElement('span');
    if (!data.furnitureName.includes("電視")){
        equipmentSpan3.className="del"
    }
    const equipmentImg3 = document.createElement('img');
    equipmentImg3.src = "/public/images/equipment_icon/icon_TV.png"
    const equipment3 = document.createElement('h6');
    equipment3.textContent = "電視";
    equipmentSpan3.appendChild(equipmentImg3);
    equipmentSpan3.appendChild(equipment3);
    equipmentList.appendChild(equipmentSpan3);
    //span4
    const equipmentSpan4 = document.createElement('span');
    if (!data.furnitureName.includes("冷氣")){
        equipmentSpan4.className="del"
    }
    const equipmentImg4 = document.createElement('img');
    equipmentImg4.src = "/public/images/equipment_icon/icon_AC.png"
    const equipment4 = document.createElement('h6');
    equipment4.textContent = "冷氣";
    equipmentSpan4.appendChild(equipmentImg4);
    equipmentSpan4.appendChild(equipment4);
    equipmentList.appendChild(equipmentSpan4);
    //span5
    const equipmentSpan5 = document.createElement('span');
    if (!data.furnitureName.includes("熱水器")){
        equipmentSpan5.className="del"
    }
    const equipmentImg5 = document.createElement('img');
    equipmentImg5.src = "/public/images/equipment_icon/icon_hotwater.png"
    const equipment5 = document.createElement('h6');
    equipment5.textContent = "熱水器";
    equipmentSpan5.appendChild(equipmentImg5);
    equipmentSpan5.appendChild(equipment5);
    equipmentList.appendChild(equipmentSpan5);
    //span6
    const equipmentSpan6 = document.createElement('span');
    if (!data.furnitureName.includes("床")){
        equipmentSpan6.className="del"
    }
    const equipmentImg6 = document.createElement('img');
    equipmentImg6.src = "/public/images/equipment_icon/icon_bed.png"
    const equipment6 = document.createElement('h6');
    equipment6.textContent = "床";
    equipmentSpan6.appendChild(equipmentImg6);
    equipmentSpan6.appendChild(equipment6);
    equipmentList.appendChild(equipmentSpan6);
    //span7
    const equipmentSpan7 = document.createElement('span');
    if (!data.furnitureName.includes("衣櫃")){
        equipmentSpan7.className="del"
    }
    const equipmentImg7 = document.createElement('img');
    equipmentImg7.src = "/public/images/equipment_icon/icon_Wardrobe.png"
    const equipment7 = document.createElement('h6');
    equipment7.textContent = "衣櫃";
    equipmentSpan7.appendChild(equipmentImg7);
    equipmentSpan7.appendChild(equipment7);
    equipmentList.appendChild(equipmentSpan7);
    //span8
    const equipmentSpan8 = document.createElement('span');
    if (!data.furnitureName.includes("第四台")){
        equipmentSpan8.className="del"
    }
    const equipmentImg8 = document.createElement('img');
    equipmentImg8.src = "/public/images/equipment_icon/icon_TV4.png"
    const equipment8 = document.createElement('h6');
    equipment8.textContent = "第四台";
    equipmentSpan8.appendChild(equipmentImg8);
    equipmentSpan8.appendChild(equipment8);
    equipmentList.appendChild(equipmentSpan8);
    //span9
    const equipmentSpan9 = document.createElement('span');
    if (!data.furnitureName.includes("網路")){
        equipmentSpan9.className="del"
    }
    const equipmentImg9 = document.createElement('img');
    equipmentImg9.src = "/public/images/equipment_icon/icon_wifi.png"
    const equipment9 = document.createElement('h6');
    equipment9.textContent = "網路";
    equipmentSpan9.appendChild(equipmentImg9);
    equipmentSpan9.appendChild(equipment9);
    equipmentList.appendChild(equipmentSpan9);
    //span10
    const equipmentSpan10 = document.createElement('span');
    if (!data.furnitureName.includes("沙發")){
        equipmentSpan10.className="del"
    }
    const equipmentImg10 = document.createElement('img');
    equipmentImg10.src = "/public/images/equipment_icon/icon_sofa.png"
    const equipment10 = document.createElement('h6');
    equipment10.textContent = "沙發";
    equipmentSpan10.appendChild(equipmentImg10);
    equipmentSpan10.appendChild(equipment10);
    equipmentList.appendChild(equipmentSpan10);
    //span11
    const equipmentSpan11 = document.createElement('span');
    if (!data.furnitureName.includes("桌椅")){
        equipmentSpan11.className="del"
    }
    const equipmentImg11 = document.createElement('img');
    equipmentImg11.src = "/public/images/equipment_icon/icon_table.png"
    const equipment11 = document.createElement('h6');
    equipment11.textContent = "桌椅";
    equipmentSpan11.appendChild(equipmentImg11);
    equipmentSpan11.appendChild(equipment11);
    equipmentList.appendChild(equipmentSpan11);
    //span12
    const equipmentSpan12 = document.createElement('span');
    if (!data.furnitureName.includes("陽台")){
        equipmentSpan12.className="del"
    }
    const equipmentImg12 = document.createElement('img');
    equipmentImg12.src = "/public/images/equipment_icon/icon_balcony.png"
    const equipment12 = document.createElement('h6');
    equipment12.textContent = "陽台";
    equipmentSpan12.appendChild(equipmentImg12);
    equipmentSpan12.appendChild(equipment12);
    equipmentList.appendChild(equipmentSpan12);
    //span13
    const equipmentSpan13 = document.createElement('span');
    if (!data.furnitureName.includes("電梯")){
        equipmentSpan13.className="del"
    }
    const equipmentImg13 = document.createElement('img');
    equipmentImg13.src = "/public/images/equipment_icon/icon_ev.png"
    const equipment13 = document.createElement('h6');
    equipment13.textContent = "電梯";
    equipmentSpan13.appendChild(equipmentImg13);
    equipmentSpan13.appendChild(equipment13);
    equipmentList.appendChild(equipmentSpan13);
    //span14
    const equipmentSpan14 = document.createElement('span');
    if (!data.furnitureName.includes("車位")){
        equipmentSpan14.className="del"
    }
    const equipmentImg14 = document.createElement('img');
    equipmentImg14.src = "/public/images/equipment_icon/icon_park.png"
    const equipment14 = document.createElement('h6');
    equipment14.textContent = "車位";
    equipmentSpan14.appendChild(equipmentImg14);
    equipmentSpan14.appendChild(equipment14);
    equipmentList.appendChild(equipmentSpan14);
    //span15
    const equipmentSpan15 = document.createElement('span');
    if (!data.furnitureName.includes("天然瓦斯")){
        equipmentSpan15.className="del"
    }
    const equipmentImg15 = document.createElement('img');
    equipmentImg15.src = "/public/images/equipment_icon/icon_gas.png"
    const equipment15 = document.createElement('h6');
    equipment15.textContent = "天然瓦斯";
    equipmentSpan15.appendChild(equipmentImg15);
    equipmentSpan15.appendChild(equipment15);
    equipmentList.appendChild(equipmentSpan15);
    rightService.appendChild(smallTitleRight)
    rightService.appendChild(equipmentList)
    leftRight.appendChild(leftService)
    leftRight.appendChild(rightService)
    equipmentInfo.appendChild(equipmentTitle);
    equipmentInfo.appendChild(leftRight)
}

function detailBlock(data){
    const houseDetail = document.getElementById('house-detail');
    const houseDetailTitle = document.createElement('h2');
    houseDetailTitle.textContent = "房屋詳情";
    const payInformation = document.createElement('div');
    payInformation.className = "pay-information";
    const smallTitle = document.createElement('div');
    smallTitle.className = "small-title";
    const handCoinIcon = document.createElement('img');
    handCoinIcon.src = "/public/images/mdi_hand-coin-outline.png";
    const payH4 = document.createElement('h4');
    payH4.textContent = "租住費用說明";
    smallTitle.appendChild(handCoinIcon);
    smallTitle.appendChild(payH4);
    const rentUl = document.createElement('ul')
    const rentTitleLi = document.createElement('li');
    rentTitleLi.className = "list-title";
    rentTitleLi.textContent = "租金含";
    const rentContentLi = document.createElement('li');
    rentContentLi.className = "list-content";
    rentContentLi.textContent = data.detail.rentprices;
    rentUl.appendChild(rentTitleLi);
    rentUl.appendChild(rentContentLi);
    const depositUl = document.createElement('ul')
    const depositTitleLi = document.createElement('li');
    depositTitleLi.className = "list-title";
    depositTitleLi.textContent = "押金為";
    const depositContentLi = document.createElement('li');
    depositContentLi.className = "list-content";
    depositContentLi.textContent = data.basicInfo.depositMonth;
    depositUl.appendChild(depositTitleLi);
    depositUl.appendChild(depositContentLi);
    payInformation.appendChild(smallTitle);
    payInformation.appendChild(rentUl);
    payInformation.appendChild(depositUl);
    const houseLimit = document.createElement('div');
    houseLimit.className = "house-limit";
    const houseLimitTitle = document.createElement('div');
    houseLimitTitle.className = "small-title";
    const payIcon = document.createElement('img');
    payIcon.src = "/public/images/pay.png";
    const stateH4 = document.createElement('h4');
    stateH4.textContent = "房屋產權登記狀態";
    houseLimitTitle.appendChild(payIcon);
    houseLimitTitle.appendChild(stateH4);
    const rightUl = document.createElement('ul')
    const rightTitleLi = document.createElement('li');
    rightTitleLi.className = "list-title";
    rightTitleLi.textContent = "產權登記";
    const rightContentLi = document.createElement('li');
    rightContentLi.className = "list-content";
    rightContentLi.textContent = data.detail.houseRights;
    rightUl.appendChild(rightTitleLi);
    rightUl.appendChild(rightContentLi);
    const directionUl = document.createElement('ul')
    const directionTitleLi = document.createElement('li');
    directionTitleLi.className = "list-title";
    directionTitleLi.textContent = "房屋朝向";
    const directionContentLi = document.createElement('li');
    directionContentLi.className = "list-content";
    directionContentLi.textContent = data.detail.houseDirection;
    directionUl.appendChild(directionTitleLi);
    directionUl.appendChild(directionContentLi);
    const useUl = document.createElement('ul')
    const useTitleLi = document.createElement('li');
    useTitleLi.className = "list-title";
    useTitleLi.textContent = "法定用途";
    const useContentLi = document.createElement('li');
    useContentLi.className = "list-content";
    useContentLi.textContent = data.detail.houseUse;
    useUl.appendChild(useTitleLi);
    useUl.appendChild(useContentLi);
    const areaUl = document.createElement('ul')
    const areaTitleLi = document.createElement('li');
    areaTitleLi.className = "list-title";
    areaTitleLi.textContent = "建物面積";
    const areaContentLi = document.createElement('li');
    areaContentLi.className = "list-content";
    areaContentLi.textContent = data.detail.houseArea + " 平方公尺";
    areaUl.appendChild(areaTitleLi);
    areaUl.appendChild(areaContentLi);
    houseLimit.appendChild(houseLimitTitle);
    houseLimit.appendChild(rightUl);
    houseLimit.appendChild(directionUl);
    houseLimit.appendChild(useUl);
    houseLimit.appendChild(areaUl);
    houseDetail.appendChild(houseDetailTitle);
    houseDetail.appendChild(payInformation);
    houseDetail.appendChild(houseLimit)
}

function createRemark(data){
    const remarkBlock = document.getElementById('remark-block');
    const remarkTitle = document.createElement('h2');
    remarkTitle.textContent="房屋備註";
    const commentBlock = document.createElement('div');
    commentBlock.textContent=data;
    commentBlock.className="comment-block";
    remarkBlock.appendChild(remarkTitle);
    remarkBlock.appendChild(commentBlock);
}

function insertReserve(){
    const checkReserveBtn = document.getElementById('check-reserve-btn');
    checkReserveBtn.addEventListener("click",()=>{
        const houseId = window.location.href.split('/')[url.split('/').length-1]
        const memberNameInput = document.getElementById('member-name').value;
        const inputDateTime = (document.getElementById('datetime-local').value).split('T');
        const inputMemberPhone = document.getElementById('member-phone').value;
        const inputOtherQuestion = document.getElementById('other-question').value;
        const reserveErrMsg = document.getElementById('reserve-err-msg');
        const phoneRe = /09\d{2}(-\d{3}-\d{3})/;
        if (inputDateTime == ""){
            reserveErrMsg.textContent = "請務必輸入日期時間";
        } else if (inputMemberPhone.search(phoneRe)==-1){
            reserveErrMsg.textContent = "聯絡電話格式有誤";
        } else {
            checkReserveBtn.setAttribute("disabled","disabled")
            setTimeout(()=>{
                checkReserveBtn.removeAttribute("disabled")
            },2000)
            fetch('/tanantApi/reserve',{
                method:'POST',
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify({houseId:houseId,reserveName:memberNameInput,reserveDate:inputDateTime[0],reserveTime:inputDateTime[1],reseverPhone:inputMemberPhone,otherQuestion:inputOtherQuestion})
            })
            .then((res)=>{
                return res.json();
            })
            .then((resJson)=>{
                if (resJson.ok){
                    const grayblock = document.getElementById('gray-block');
                    const reserveOkBlock = document.getElementById('reserve-ok-msg');
                    grayblock.style.display = "block";
                    reserveOkBlock.style.display = "flex";
                    document.body.classList.add('stop-scroll');
                    const backIndexBtn = document.getElementById('reloadinfo-btn');
                    const goMemberBtn = document.getElementById('go-member-btn');
                    backIndexBtn.addEventListener('click',()=>{
                        location.reload();
                    });
                    goMemberBtn.addEventListener('click',()=>{
                        location.replace('/tanantmember')
                    })
                    grayblock.addEventListener("click",cancelBlock);
                }
            })
        }
    }) 
}

function updateReserve(){
    const UpdateReserveBtn = document.getElementById('update-reserve-btn');
    UpdateReserveBtn.addEventListener("click",()=>{
        const houseId = window.location.href.split('/')[url.split('/').length-1]
        const inputDateTime = (document.getElementById('update-datetime-local').value).split('T');
        const inputMemberPhone = document.getElementById('update-member-phone').value;
        const inputOtherQuestion = document.getElementById('update-other-question').value;
        const reserveErrMsg = document.getElementById('update-reserve-err-msg');
        const phoneRe = /09\d{2}(-\d{3}-\d{3})/;
        if (inputDateTime == ""){
            reserveErrMsg.textContent = "請務必輸入日期時間";
        } else if (inputMemberPhone.search(phoneRe)==-1){
            reserveErrMsg.textContent = "聯絡電話格式有誤";
        } else {
            UpdateReserveBtn.setAttribute("disabled","disabled")
            setTimeout(()=>{
                UpdateReserveBtn.removeAttribute("disabled")
            },2000)
            fetch('/tanantApi/reserve',{
                method:'PUT',
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify({houseId:houseId,reserveDate:inputDateTime[0],reserveTime:inputDateTime[1],reseverPhone:inputMemberPhone,otherQuestion:inputOtherQuestion})
            })
            .then((res)=>{
                return res.json();
            })
            .then((resJson)=>{
                if (resJson.ok){
                    const grayblock = document.getElementById('gray-block');
                    const updateOkBlock = document.getElementById('update-reserve-ok-msg');
                    grayblock.style.display = "block";
                    updateOkBlock.style.display = "flex";
                    document.body.classList.add('stop-scroll');
                    const backIndexBtn = document.getElementById('update-reloadinfo-btn');
                    const goMemberBtn = document.getElementById('update-go-member-btn');
                    backIndexBtn.addEventListener('click',()=>{
                        location.reload();
                    });
                    goMemberBtn.addEventListener('click',()=>{
                        location.replace('/tanantmember')
                    })
                    grayblock.addEventListener("click",cancelBlock);
                }
            })
        }
    }) 
}

function cancelBlock(){
    const grayblock = document.getElementById('gray-block');
    const reserveOkBlock = document.getElementById('reserve-ok-msg');
    if (reserveOkBlock.style.display = "block"){
        grayblock.style.display = "none";
        reserveOkBlock.style.display = "none";
        document.body.classList.remove("stop-scroll");
    }
}