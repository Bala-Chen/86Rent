const express = require('express');
const landlordApi = express.Router();
const { addhouseApi,upload,getHouseInfo,updateHouse } = require('../api/addhouse-api');
const memberPage = require('../api/member-page-api');
const pay = require('../api/pay-api');

//新增租屋資料(landlord)
landlordApi.post('/house',upload.array('img',5),addhouseApi)

//取得修改租屋資料(landlord)
landlordApi.get('/house',getHouseInfo)

//更新租屋資料(landlord)
landlordApi.put('/house',updateHouse)

//刪除未出租屋房子(landlord)
landlordApi.delete('/house',memberPage.deleteHouse)

//取得已出租房屋列表(landlord)
landlordApi.get('/rentedList',memberPage.getRentList)

//取得未出租房屋列表(landlord)
landlordApi.get('/notRentedList',memberPage.getNotRentList)

//取得房客預約列表(landlord)
landlordApi.get('/reserve',memberPage.getLandlordReserveList)

//取消預約(landlord)
landlordApi.delete('/reserve',memberPage.deleteLLReserve)

//取得某房屋的繳款列表(landlord)
landlordApi.get('/pay/:houseId',pay.landlordPay)

//新增帳單&修改帳單(landlord)
landlordApi.get('/bill',pay.getPrice)

//新增帳單(landlord)
landlordApi.post('/bill',pay.addRentBill)

//修改帳單(landlord)
landlordApi.put('/bill',pay.updateRentBill)

//取得房東帳戶名稱、帳戶價格(landlord)
landlordApi.get('/accountAmount',memberPage.getAccountAmountApi)

//房東申請提款(landlord)
landlordApi.put('/accountAmount',memberPage.insertGetMoney)

//出租房屋(landlord)
landlordApi.put('/rentOutHouse',memberPage.rentOutHouse)

module.exports = landlordApi