let page=0;
async function getHouseList(){
    const url = window.location.href;
    const queryString = url.split('?')[1]
    let res = await fetch('/api/houselist?page='+page+'&'+queryString);
    let resJson = await res.json();
    clickTopButton()
    if (resJson.nextPage != null){
        getResultCount(resJson.count)
        createItemBlock(resJson.data)
        page = resJson.nextPage;
        return page
    } else if (resJson.data==null && resJson.data == null){
        getResultCount(resJson.count);
        noDataBlock();
        setTimeout("location.href='/'",5000);
    } else {
        getResultCount(resJson.count)
        createItemBlock(resJson.data)
        return undefined
    }
}

let options = {
    root:null,
    rootMargins:"0px",
    threshold:0.5
};


const footer = document.querySelector('footer')
async function handleIntersect(entries,observer){
    if (entries[0].isIntersecting){
        let nextPage = await getHouseList();
        if (nextPage == undefined){
            observer.unobserve(footer)
        } else {
            page = nextPage
        }
    }    
}

const observer = new IntersectionObserver(handleIntersect,options);
observer.observe(footer);

function getResultCount(count){
    const countBlock = document.getElementById('result-count');
    countBlock.textContent = count;
}

function createItemBlock(data){
    for(i=0;i<data.length;i++){
        const resultBlock = document.getElementById('result-block');
        const houseItemBlock = document.createElement('div');
        houseItemBlock.className = 'house-item-block';
        houseItemBlock.id = data[i].houseId;
        const houseItemImg = document.createElement('div');
        houseItemImg.className = 'house-item-img';
        const img = document.createElement('img');
        img.src = data[i].imgUrl;
        houseItemImg.appendChild(img)
        const houseItemInfo = document.createElement('div');
        houseItemInfo.className = 'house-item-info';
        const houseH2 = document.createElement('h2');
        houseH2.textContent = data[i].houseName;
        const houseTagUl = document.createElement('ul');
        if (data[i].tag.length == 1 && data[i].tag[0] == "無"){
            const houseTagli = document.createElement('li');
            houseTagli.style.backgroundColor = "#FFFFFF"
            houseTagUl.appendChild(houseTagli)
        } else {
            for (j=0;j<data[i].tag.length;j++){
                const houseTagli = document.createElement('li');
                houseTagli.textContent = data[i].tag[j]
                houseTagUl.appendChild(houseTagli)
            }
        };
        const houseH4 = document.createElement('h4');
        houseH4.textContent = data[i].roomName +' ｜ ' +data[i].pingNum+'坪 ｜ '+data[i].houseFloor+'F';
        const houseP = document.createElement('p');
        const houseIconImg = document.createElement('img');
        houseIconImg.src = '/public/images/home.png';
        const addressSpan = document.createElement('span');
        addressSpan.textContent = data[i].houseAddress;
        houseP.appendChild(houseIconImg);
        houseP.appendChild(addressSpan)
        const pattrenP = document.createElement('p');
        const pattrenIconImg = document.createElement('img');
        pattrenIconImg.src = '/public/images/room-sum.PNG';
        const pattrenSpan = document.createElement('span');
        pattrenSpan.textContent = data[i].housePattren;
        pattrenP.appendChild(pattrenIconImg);
        pattrenP.appendChild(pattrenSpan);
        const personH4 = document.createElement('h4');
        personH4.textContent=data[i].contactName+" "+data[i].callName;
        const buttonAndPrice = document.createElement('div');
        buttonAndPrice.className='btn-and-price';
        const detailButton = document.createElement('button');
        detailButton.id =data[i].houseId + "-btn";
        detailButton.textContent = "查看詳情"
        detailButton.addEventListener('click',goHouseInfoPage)
        const priceH3 = document.createElement('h3');
        priceH3.textContent=data[i].rentPrice;
        const unit = document.createElement('span');
        unit.textContent="元/月"
        priceH3.appendChild(unit);
        buttonAndPrice.appendChild(detailButton);
        buttonAndPrice.appendChild(priceH3);
        houseItemInfo.appendChild(houseH2);
        houseItemInfo.appendChild(houseTagUl);
        houseItemInfo.appendChild(houseH4);
        houseItemInfo.appendChild(houseP);
        houseItemInfo.appendChild(pattrenP);
        houseItemInfo.appendChild(personH4);
        houseItemInfo.appendChild(buttonAndPrice);
        houseItemBlock.appendChild(houseItemImg);
        houseItemBlock.appendChild(houseItemInfo);
        resultBlock.appendChild(houseItemBlock);
        const hrLine = document.createElement('hr');
        resultBlock.appendChild(hrLine)
    }
}

function noDataBlock(){
    const resultBlock = document.getElementById('result-block');
    const noDataMsg = document.createElement('div');
    noDataMsg.className = "no-result-msg"
    noDataMsg.textContent = "查無資料，5 秒後為您導向首頁"
    resultBlock.appendChild(noDataMsg)
}

//click button to sort
const defaultButton = document.getElementById('default-button');
const recentButton = document.getElementById('recent-button');
const rentsortButton = document.getElementById('rentsort-button');
const roomsumButton = document.getElementById('roomsum-button');

defaultButton.addEventListener('click',editUrl.bind(null,""))
recentButton.addEventListener('click',editUrl.bind(null,"recent"))
rentsortButton.addEventListener('click',editUrl.bind(null,"rentup"))
roomsumButton.addEventListener('click',editUrl.bind(null,"roomsum"))

function clickTopButton(){
    const url = window.location.href;
    if (url.includes("recent=true")){
        defaultButton.style.color = "#999999";
        recentButton.style.color = "#269A85";
        rentsortButton.style.color = "#999999";
        roomsumButton.style.color = "#999999";
    } else if(url.includes("rentup=true")){
        defaultButton.style.color = "#999999";
        recentButton.style.color = "#999999";
        rentsortButton.style.color = "#269A85";
        roomsumButton.style.color = "#999999";
    } else if (url.includes("roomsum=true")) {
        defaultButton.style.color = "#999999";
        recentButton.style.color = "#999999";
        rentsortButton.style.color = "#999999";
        roomsumButton.style.color = "#269A85";
    } else {
        defaultButton.style.color = "#269A85";
        recentButton.style.color = "#999999";
        rentsortButton.style.color = "#999999";
        roomsumButton.style.color = "#999999"
    }
}

function editUrl(query){
    const nowUrl = new URL(window.location.href);
    let params = nowUrl.searchParams;
    params.delete("recent");
    params.delete("rentup");
    params.delete("roomsum");
    if (query!=""){
        params.append(query,true)
    } 
    nowUrl.search=params.toString();
    window.location.href=nowUrl.href;
}

const filterBtn = document.getElementById('filter-search-btn');
filterBtn.addEventListener('click',()=>{
    const selectRoomType = document.getElementById('selectRoomType').value;
    const selectBuildingType = document.getElementById('selectBuildingType').value;
    const selectRoomSum = document.getElementById('selectRoomSum').value;
    const nowUrl = new URL(window.location.href);
    let params = nowUrl.searchParams;
    params.delete("selectRoomType");
    params.delete("selectBuildingType");
    params.delete("selectRoomSum");
    params.append("selectRoomType",selectRoomType);
    params.append("selectBuildingType",selectBuildingType);
    params.append("selectRoomSum",selectRoomSum);
    nowUrl.search=params.toString();
    window.location.href=nowUrl.href;
})

document.getElementById('gohome-btn').addEventListener('click',()=>{
    location.replace('/')
})

document.getElementById('gotop-btn').addEventListener('click',()=>{
    window.scrollTo({
        top:0
    })
})

//check into houseinfo page
function goHouseInfoPage(){
    let getID = this.id.split("-btn")[0];
    window.location.href="/houseinfo/" + getID;
}