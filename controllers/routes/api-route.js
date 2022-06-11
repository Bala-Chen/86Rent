const express = require('express');
const generallyApi = express.Router();
const { houseList } = require('../api/search-api');
const houseInfoPage = require('../api/houseinfo-api');
const memberPage = require('../api/member-page-api');

//取得未出租房屋搜尋資料(all)
generallyApi.get('/houselist',houseList)

//取得詳細房屋資料(all)
generallyApi.get('/houseinfo/:houseId',houseInfoPage.houseInfoApi)

//退租(tenant-landlord)
generallyApi.delete('/quitRent',memberPage.quitRent)

module.exports = generallyApi