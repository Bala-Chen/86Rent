const express = require('express');
const tanantApi = express.Router();
const memberPage = require('../api/member-page-api');
const houseInfoPage = require('../api/houseinfo-api');
const pay = require('../api/pay-api');

//取得房客出租屋管理(tanant)
tanantApi.get('/rentedList',memberPage.getTanantRentList);

//取得房東預約列表(tanant)
tanantApi.get('/reserve',memberPage.getTanantReserveList)

//塞入預約資訊(tanant-all)
tanantApi.post('/reserve',houseInfoPage.reserveApi)

//更新預約(tanant-all)
tanantApi.put('/reserve',houseInfoPage.updateReserveApi)

//取消預約(tanant)
tanantApi.delete('/reserve',memberPage.deleteReserve)

//取得某房屋的繳款列表(tanant)
tanantApi.get('/pay/:houseId',pay.tanantPay)

//取得繳款系統資訊(tanant)
tanantApi.get('/payBill/:billId',pay.getPayBill)

//tappay付款(tanant)
tanantApi.post('/payBill',pay.postToTappay)

module.exports = tanantApi