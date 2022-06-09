const indexView = (req,res)=>{
    res.render('index')
}

const searchView = (req,res)=>{
    res.render('search-result');
}

const houseInfoView = (req,res)=>{
    res.render('house-info');
}

const signinView = (req,res)=>{
    res.render('signin');
}

const chooseRegisterView = (req,res)=>{
    res.render('choose-register');
}

const registerLondloadView = (req,res)=>{
    res.render('register-londload');
}

const registerTanantView = (req,res)=>{
    res.render('register-tanant');
}

const addHouseView = (req,res)=>{
    res.render('add-house');
}

const londloadPageView = (req,res)=>{
    res.render('londload-page');
}

const tanantPageView = (req,res)=>{
    res.render('tanant-page');
}

const londloadReserveView = (req,res)=>{
    res.render('reserve-page')
}

const londloadPayList = (req,res)=>{
    res.render('londload-paylist')
}

const londloadAddBill = (req,res)=>{
    res.render('add-bill')
}

const tanantPaylist = (req,res)=>{
    res.render('tanant-paylist')
}

const payPageView = (req,res)=>{
    res.render('pay-page')
}

const fixBillPageView = (req,res)=>{
    res.render('fix-bill')
}

const fixHouseView = (req,res)=>{
    res.render('fix-houseform')
}

module.exports = {
    indexView:indexView,
    searchView:searchView,
    houseInfoView:houseInfoView,
    signinView:signinView,
    chooseRegisterView:chooseRegisterView,
    registerLondloadView:registerLondloadView,
    registerTanantView:registerTanantView,
    addHouseView:addHouseView,
    londloadPageView:londloadPageView,
    tanantPageView:tanantPageView,
    londloadReserveView:londloadReserveView,
    londloadPayList:londloadPayList,
    londloadAddBill:londloadAddBill,
    tanantPaylist:tanantPaylist,
    payPageView:payPageView,
    fixBillPageView:fixBillPageView,
    fixHouseView:fixHouseView
}
