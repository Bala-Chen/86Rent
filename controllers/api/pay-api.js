const Pool  = require('../../models/db');
const fetch = require('node-fetch');
require('dotenv').config({path:process.cwd()+"/config/.env"})

const addRentBill = async(req,res) =>{
    const addNow = Date.now();
    const billID = "B"+ _createId();
    const sql = "INSERT INTO rentbill_list(`bill_id`,`house_id`,`total`,`rent`,`water`,`electric`,`manage`,`clean`,`four`,`net`,`gas`,`parking`,`add_time`) \
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)"
    const val = [billID,
        req.body.houseID,
        req.body.totalMoney,
        req.body.rentPrice,
        req.body.waterPrice,
        req.body.electricPrice,
        req.body.managePrice,
        req.body.cleanPrice,
        req.body.fourPrice,
        req.body.netPrice,
        req.body.gasPrice,
        req.body.parkingPrice,
        addNow]
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,sql,val)
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

function _createId(){
    const rawPre = (Date.now()-new Date(1652098249212).getTime()) / 1000 ;  //.gettime取得日期經過毫秒數
    const preNumber = Number(rawPre.toFixed()) * 1000; //tofixed四捨五入取整數
    const randam = Math.floor(Math.random() * 1000);  //0.321223 => 321
    const tenNum = String(preNumber+randam).slice(-10)
    return tenNum
}

const londloadPay = async(req,res)=>{
    const houseId = req.params.houseId;
    const val = [houseId,]
    const titleSql ="SELECT house_name,tanant_name \
    FROM already_rented AS ar \
    LEFT JOIN housing_info AS hi ON ar.house_id = hi.house_id \
    LEFT JOIN tanant_member AS tm ON ar.tanant_id=tm.tanant_id \
    WHERE ar.house_id = ?;"
    const connection1 = await Pool.getConnection();
    const titleResult = await Pool.query(connection1,titleSql,val);
    if (titleResult[0]==undefined){
        return res.json({payList:null})
    } else {
        const sql = "SELECT status,bill_id,add_time,total,pay_time,rent,water,electric,manage,clean,four,net,gas,parking \
        FROM rentbill_list \
        WHERE house_id = ? \
        ORDER BY add_time DESC;"
        const connection = await Pool.getConnection();
        const result = await Pool.query(connection,sql,val);
        if (result[0]== undefined){
            return res.json({payList:{houseName:titleResult[0].house_name,tanantName:titleResult[0].tanant_name,data:null}})
        } else {
            let dataList = [];
            for (i=0;i<result.length;i++){
                const addTime = _timeStampToDate(result[i].add_time);
                let payTime;
                if (result[i].pay_time != '-'){
                    payTime = _timeStampToDate(result[i].pay_time);
                } else {
                    payTime = result[i].pay_time;
                }
                let data = {
                    billId:result[i].bill_id,
                    status:result[i].status,
                    setDate:addTime,
                    totalPrice:result[i].total,
                    payDate:payTime,
                    infoData:{
                        rent:result[i].rent,
                        water:result[i].water,
                        electric:result[i].electric,
                        manage:result[i].manage,
                        clean:result[i].clean,
                        four:result[i].four,
                        net:result[i].net,
                        gas:result[i].gas,
                        parking:result[i].parking
                    }
                }
                dataList.push(data)                
            }
            return res.json({payList:{houseName:titleResult[0].house_name,tanantName:titleResult[0].tanant_name,data:dataList}})
        }
    }
}

const _timeStampToDate = (timestamp) =>{
    const buildDate = new Date(Number(timestamp));
    const buildDateYear = buildDate.getFullYear();
    const buildDateMonth = buildDate.getMonth() + 1 < 10 ? "0" + (buildDate.getMonth() + 1) : buildDate.getMonth() + 1 ;
    const buildDateDate = buildDate.getDate() < 10 ? "0" + buildDate.getDate() : buildDate.getDate();
    const fullDate = buildDateYear+"-"+buildDateMonth+"-"+buildDateDate
    return fullDate
}

const tanantPay = async(req,res)=>{
    const houseId = req.params.houseId;
    const val = [houseId,]
    const titleSql ="SELECT house_name,londload_name,londload_cellphone \
    FROM already_rented AS ar \
    LEFT JOIN housing_info AS hi ON ar.house_id = hi.house_id \
    LEFT JOIN londload_member AS lm ON ar.londload_id=lm.londload_id \
    WHERE ar.house_id = ?;"
    const connection1 = await Pool.getConnection();
    const titleResult = await Pool.query(connection1,titleSql,val);
    if (titleResult[0]==undefined){
        return res.json({payList:null})
    } else {
        const sql = "SELECT status,bill_id,add_time,total,pay_time,rent,water,electric,manage,clean,four,net,gas,parking \
        FROM rentbill_list \
        WHERE house_id = ? \
        ORDER BY add_time DESC;"
        const connection = await Pool.getConnection();
        const result = await Pool.query(connection,sql,val);
        if (result[0]== undefined){
            return res.json({payList:{houseName:titleResult[0].house_name,londloadName:titleResult[0].londload_name,londloadPhone:titleResult[0].londload_cellphone,data:null}})
        } else {
            let dataList = [];
            for (i=0;i<result.length;i++){
                const addTime = _timeStampToDate(result[i].add_time);
                let payTime;
                if (result[i].pay_time != '-'){
                    payTime = _timeStampToDate(result[i].pay_time);
                } else {
                    payTime = result[i].pay_time;
                }
                let data = {
                    billId:result[i].bill_id,
                    status:result[i].status,
                    setDate:addTime,
                    totalPrice:result[i].total,
                    payDate:payTime,
                    infoData:{
                        rent:result[i].rent,
                        water:result[i].water,
                        electric:result[i].electric,
                        manage:result[i].manage,
                        clean:result[i].clean,
                        four:result[i].four,
                        net:result[i].net,
                        gas:result[i].gas,
                        parking:result[i].parking
                    }
                }
                dataList.push(data)                
            }
            return res.json({payList:{houseName:titleResult[0].house_name,londloadName:titleResult[0].londload_name,londloadPhone:titleResult[0].londload_cellphone,data:dataList}})
        }
    }
}

const getPayBill = async(req,res)=>{
    const billId = req.params.billId;
    const sql = "SELECT add_time,total,rent,water,electric,manage,clean,four,net,gas,parking \
    FROM rentbill_list \
    WHERE bill_id = ? \
    ORDER BY add_time DESC;"
    const val = [billId,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    const addTime = _timeStampToDate(result[0].add_time);
    let data = {
        setDate:addTime,
        totalPrice:result[0].total,
        rent:result[0].rent,
        water:result[0].water,
        electric:result[0].electric,
        manage:result[0].manage,
        clean:result[0].clean,
        four:result[0].four,
        net:result[0].net,
        gas:result[0].gas,
        parking:result[0].parking
    }
    return res.json({billData:data})
}

const _getTanantPhone = async(email) =>{
    sql = "SELECT tanant_cellphone FROM tanant_member WHERE tanant_email=?;"
    val = [email,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    return result[0].tanant_cellphone;
}

const postToTappay = async(req,res)=>{
    const email = req.session.user;
    const tanantPhone = await _getTanantPhone(email)
    const tappayData = {
        "prime": req.body.prime,
        "partner_key":process.env.PARTNER_KEY,
        "merchant_id": "guava422448_CTBC",
        "order_number":req.body.billId,
        "details":"86rent house bill",
        "amount": parseInt(req.body.totalPrice),
        "cardholder": {
            "phone_number": tanantPhone,
            "name": req.body.cardName,
            "email": email
        }
    };

    const result = await fetch("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",{
        method:'POST',
        headers: {'Content-Type': 'application/json','x-api-key': process.env.PARTNER_KEY},
        body:JSON.stringify(tappayData)
    })
    .then(res => res.json());

    if (result.status==0 && result.msg =="Success"){
        const selectLondloadSql = "SELECT total,londload_id, account_amount FROM rentbill_list \
        NATURAL JOIN already_rented \
        NATURAL JOIN londload_account \
        WHERE house_id = ? AND bill_id = ?;"
        const selectLondloadVal = [req.body.houseId,req.body.billId]
        const selectConnection = await Pool.getConnection();
        const selectResult = await Pool.query(selectConnection,selectLondloadSql,selectLondloadVal)
        const addNow = Date.now();
        const newTotal = Number(selectResult[0].account_amount + selectResult[0].total);
        const updateBillSql = "UPDATE rentbill_list SET status='O', pay_time=? WHERE bill_id = ?;"
        const updateBillVal = [addNow,req.body.billId];
        const updateAmountSql = "UPDATE londload_account SET account_amount=? WHERE londload_id = ?"
        const updateAmountVal = [newTotal,selectResult[0].londload_id]
        const connection = await Pool.getConnection();
        try{
            await Pool.beginTransaction(connection);
            await Pool.query(connection,updateBillSql ,updateBillVal)
            await Pool.query(connection,updateAmountSql,updateAmountVal)
            await Pool.commit(connection);
        } catch(err){
            await Pool.rollback(connection,err);
        }
        return res.json({ok:true})
    } else {
        return res.json({error:true,msg:"付款失敗"})
    }    
}

const updateRentBill = async(req,res) =>{
    const sql = "UPDATE rentbill_list SET `total`=?,`rent`=?,`water`=?,`electric`=?,`manage`=?,`clean`=?,`four`=?,`net`=?,`gas`=?,`parking`=? \
    WHERE bill_id = ? AND house_id = ?"
    const val = [
        req.body.totalMoney,
        req.body.rentPrice,
        req.body.waterPrice,
        req.body.electricPrice,
        req.body.managePrice,
        req.body.cleanPrice,
        req.body.fourPrice,
        req.body.netPrice,
        req.body.gasPrice,
        req.body.parkingPrice,
        req.body.billID,
        req.body.houseID]
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,sql,val)
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

const getPrice = async(req,res) =>{
    if (req.query.billId){
        const sql = "SELECT `total`,`rent`,`water`,`electric`,`manage`,`clean`,`four`,`net`,`gas`,`parking` \
        FROM rentbill_list \
        WHERE house_id = ? AND bill_id = ?"
        const val = [req.query.houseId,req.query.billId];
        const connection = await Pool.getConnection();
        const result = await Pool.query(connection,sql,val);
        const price = {
            total: result[0].total,
            rent: result[0].rent,
            water: result[0].water,
            electric: result[0].electric,
            manage: result[0].manage,
            clean: result[0].clean,
            four: result[0].four,
            net: result[0].net,
            gas: result[0].gas,
            parking: result[0].parking
        }
        return res.json({price:price})
    } else {
        const sql = "SELECT rent_price FROM housing_info WHERE house_id= ?";
        const val = [req.query.houseId,];
        const connection = await Pool.getConnection();
        const result = await Pool.query(connection,sql,val);
        return res.json({price:{rent:result[0].rent_price}})
    }
}

module.exports = {
    addRentBill:addRentBill,
    londloadPay:londloadPay,
    tanantPay:tanantPay,
    getPayBill:getPayBill,
    postToTappay:postToTappay,
    updateRentBill:updateRentBill,
    getPrice:getPrice
}