const { stringify } = require('querystring');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const Pool  = require('../../models/db');
require('dotenv').config({path:process.cwd()+"/config/.env"});
const envfile = process.env.CAPTCHA_SECRETKEY;

const registerApi = async(req,res)=>{
    if (!req.body.captcha){
        return res.json({error:true,msg:"你是機器人嗎?請打個勾"})
    }    
    const query = stringify({
        secret:envfile,
        response:req.body.captcha,
        remoteip:req.connection.remoteAddress
    })
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    const body = await fetch(verifyURL).then(res => res.json());
    if (body.success !== undefined && !body.success){
        return res.json({ error:true, msg: 'reCAPTCHA驗證碼出錯' })
    };
    const result = await _selectEmail(req.body.email)
    if (result == false){
        return res.json({error:true, msg: '此Email已被註冊過'})
    }
    const reqUrl = req.headers.referer;
    if (reqUrl.split('/')[reqUrl.split('/').length-1] == "londload"){
        const londloadId = "L" + _createID();
        const sql = "INSERT INTO londload_member VALUES(?,?,?,?,?,?)"
        await _insertMemberData(req,londloadId,sql)
        
    } else if (reqUrl.split('/')[reqUrl.split('/').length-1] == "tanant"){
        const tanantId = "T" + _createID();
        const sql = "INSERT INTO tanant_member VALUES(?,?,?,?,?,?)"
        await _insertMemberData(req,tanantId,sql)
    }
    return res.json({ok:true}) 
}

const _selectEmail = async(email)=>{
    const connection = await Pool.getConnection();
    const sql = "SELECT londload_email AS email FROM londload_member WHERE londload_email= ? UNION SELECT tanant_email FROM tanant_member WHERE tanant_email= ? ;"
    const val = [email,email]
    const result = await Pool.query(connection,sql,val);
    if (result[0]== undefined){
        return true
    } else {
        return false
    }
}

const _createID = ()=>{
    const rawPre = (Date.now()-new Date(1652098249212).getTime()) / 1000 ;  //.gettime取得日期經過毫秒數
    const preNumber = Number(rawPre.toFixed()) * 1000; //tofixed四捨五入取整數
    const randam = Math.floor(Math.random() * 1000);  //0.321223 => 321
    const eightNum = String(preNumber+randam).slice(-8)
    return eightNum
}

const _insertMemberData = async(req,id,sqlIn)=>{
    const saltRounds = 10;
    const pwdHash = bcrypt.hashSync(req.body.password, saltRounds);  
    const valueIn = [id,req.body.email,pwdHash,req.body.allname,req.body.gender,req.body.cellphone]
    const connection = await Pool.getConnection();
    if (id[0]=="L"){
        const addAmountsql = "INSERT INTO londload_account(londload_id) VALUES (?);"
        try{
            await Pool.beginTransaction(connection);
            await Pool.query(connection,sqlIn,valueIn);
            await Pool.query(connection,addAmountsql,[id,])
            await Pool.commit(connection);
        } catch(err){
            await Pool.rollback(connection,err)
        }
    } else {
        try{
            await Pool.beginTransaction(connection);
            await Pool.query(connection,sqlIn,valueIn);
            await Pool.commit(connection);
        } catch(err){
            await Pool.rollback(connection,err)
        }
    }
}

const signinApi = async(req,res) =>{
    const connection = await Pool.getConnection();
    const sql = "SELECT londload_password AS password FROM londload_member WHERE londload_email = ? UNION SELECT tanant_password FROM tanant_member WHERE tanant_email = ? ";
    const val = [req.body.email,req.body.email];
    const result = await Pool.query(connection,sql,val);
    if (result[0] == undefined){
        return res.json({error:true,msg:"帳號不存在，請確認輸入內容"})
    }
    const resultPwd = result[0].password
    const pwdCompare = bcrypt.compareSync(req.body.password,resultPwd)
    if (pwdCompare == false){
        return res.json({error:true,msg:"密碼輸入有誤"})
    } else {
        req.session.user = req.body.email;
        return res.json({ok:true})
    }
}

const signoutApi = (req,res)=>{
    req.session.destroy((err)=>{
        res.clearCookie('session');
        return res.json({ok:true})
    })
}

const memberStatusApi = async(req,res)=>{
    if(req.session.user != null){
        const connection = await Pool.getConnection();
        const email = req.session.user;
        const sql = "SELECT londload_id AS id,londload_name AS name FROM londload_member WHERE londload_email = ? UNION SELECT tanant_id, tanant_name FROM tanant_member WHERE tanant_email = ?;"
        const val = [email,email]
        const result = await Pool.query(connection,sql,val);
        return res.json({data:{id:result[0].id,name:result[0].name,email:email}})
    } else {
        return res.json({data:null})
    }
}

module.exports ={
    registerApi,
    signinApi,
    signoutApi,
    memberStatusApi
}

