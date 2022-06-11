const express = require('express');
const tenantApi = express.Router();
const memberPage = require('../api/member-page-api');
const houseInfoPage = require('../api/houseinfo-api');
const pay = require('../api/pay-api');

//取得房客出租屋管理(tenant)
tenantApi.get('/rentedList',memberPage.getTenantRentList);

//取得房東預約列表(tenant)
tenantApi.get('/reserve',memberPage.getTenantReserveList)

//塞入預約資訊(tenant-all)
tenantApi.post('/reserve',houseInfoPage.reserveApi)

//更新預約(tenant-all)
tenantApi.put('/reserve',houseInfoPage.updateReserveApi)

//取消預約(tenant)
tenantApi.delete('/reserve',memberPage.deleteReserve)

//取得某房屋的繳款列表(tenant)
tenantApi.get('/pay/:houseId',pay.tenantPay)

//取得繳款系統資訊(tenant)
tenantApi.get('/payBill/:billId',pay.getPayBill)

//tappay付款(tenant)
tenantApi.post('/payBill',pay.postToTappay)

module.exports = tenantApi