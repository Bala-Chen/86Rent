const express = require('express');
const {registerApi,signinApi,signoutApi,memberStatusApi} = require('../api/member-api')

const memberApi = express.Router();

memberApi.get('/',memberStatusApi)

memberApi.post('/',registerApi)

memberApi.patch('/',signinApi)

memberApi.delete('/',signoutApi)

module.exports = memberApi