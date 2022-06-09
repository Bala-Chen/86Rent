const express = require('express');
const londloadApi = express.Router();
const { addhouseApi,upload,getHouseInfo,updateHouse } = require('../api/addhouse-api');
const memberPage = require('../api/member-page-api');
const pay = require('../api/pay-api');

//新增租屋資料(londload)
londloadApi.post('/house',upload.array('img',5),addhouseApi)

//取得修改租屋資料(londload)
londloadApi.get('/house',getHouseInfo)

//更新租屋資料(londload)
londloadApi.put('/house',updateHouse)

//刪除未出租屋房子(londload)
londloadApi.delete('/house',memberPage.deleteHouse)

//取得已出租房屋列表(londload)
londloadApi.get('/rentedList',memberPage.getRentList)

//取得未出租房屋列表(londload)
londloadApi.get('/notRentedList',memberPage.getNotRentList)

//取得房客預約列表(londload)
londloadApi.get('/reserve',memberPage.getLondLoadReserveList)

//取消預約(londload)
londloadApi.delete('/reserve',memberPage.deleteLLReserve)

//取得某房屋的繳款列表(londload)
londloadApi.get('/pay/:houseId',pay.londloadPay)

//新增帳單&修改帳單(londload)
londloadApi.get('/bill',pay.getPrice)

//新增帳單(londload)
londloadApi.post('/bill',pay.addRentBill)

//修改帳單(londload)
londloadApi.put('/bill',pay.updateRentBill)

//取得房東帳戶名稱、帳戶價格(londload)
londloadApi.get('/accountAmount',memberPage.getAccountAmountApi)

//房東申請提款(londload)
londloadApi.put('/accountAmount',memberPage.insertGetMoney)

//出租房屋(londload)
londloadApi.put('/rentOutHouse',memberPage.rentOutHouse)

module.exports = londloadApi