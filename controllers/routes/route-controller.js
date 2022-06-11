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

const registerLandlordView = (req,res)=>{
    res.render('register-landlord');
}

const registerTenantView = (req,res)=>{
    res.render('register-tenant');
}

const addHouseView = (req,res)=>{
    res.render('add-house');
}

const landlordPageView = (req,res)=>{
    res.render('landlord-page');
}

const tenantPageView = (req,res)=>{
    res.render('tenant-page');
}

const landlordReserveView = (req,res)=>{
    res.render('reserve-page')
}

const landlordPayList = (req,res)=>{
    res.render('landlord-paylist')
}

const landlordAddBill = (req,res)=>{
    res.render('add-bill')
}

const tenantPaylist = (req,res)=>{
    res.render('tenant-paylist')
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
    registerLandlordView:registerLandlordView,
    registerTenantView:registerTenantView,
    addHouseView:addHouseView,
    landlordPageView:landlordPageView,
    tenantPageView:tenantPageView,
    landlordReserveView:landlordReserveView,
    landlordPayList:landlordPayList,
    landlordAddBill:landlordAddBill,
    tenantPaylist:tenantPaylist,
    payPageView:payPageView,
    fixBillPageView:fixBillPageView,
    fixHouseView:fixHouseView
}
