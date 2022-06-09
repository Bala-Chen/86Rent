function closeSelect(e){
    const selectBlock = document.getElementById("select-city");
    if (selectBlock.style.display == "block"){
        if (e.target.id !== "city-block" && e.target.id !== "input-city" && e.target.id !== "city-arrow"){
            selectBlock.style.display = "none";
        }
    }
}

document.addEventListener("click",closeSelect)

function openCity(){
    const selectBlock = document.getElementById("select-city");
    if (selectBlock.style.display == "none"){
        selectBlock.style.display = "block";
    } else{
        selectBlock.style.display = "none";
    }
}

const cityInput = document.getElementById("city-block").addEventListener('click',openCity);

function selectCity(){
    const selectBlock = document.getElementById("select-city");
    const oldCity = document.getElementById('input-city');
    const newCity = this.textContent;
    oldCity.textContent = newCity;
    selectBlock.style.display = "none";
}

for (i=1; i<23; i++){
    document.getElementById('city-'+i).addEventListener("click",selectCity);
}

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener("click",clickSearchBtn)

function clickSearchBtn(){
    const city = document.getElementById('input-city').textContent;
    const searchBlock = document.getElementById('index-keyword').value;
    if (city =="地區" && searchBlock ==""){
        location.replace('/search');
    } else if (city !="地區" && searchBlock ==""){
        location.replace('/search?city='+city)
    } else if (city == "地區" && searchBlock !=""){
        location.replace('/search?keyword='+searchBlock)
    } else{
        location.replace('/search?city='+city+"&keyword="+searchBlock)
    }
}
