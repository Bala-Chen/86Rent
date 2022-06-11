const Pool  = require('../../models/db');

const getRentList = async(req,res)=>{
    const email = req.session.user;
    const landlordId = await _getLandlordId(email)
    const sql = "SELECT ar.house_id,house_name,rent_price,add_timestamp,tenant_name,img_url \
    FROM already_rented AS ar \
    LEFT JOIN tenant_member AS tm ON ar.tenant_id = tm.tenant_id \
    LEFT JOIN housing_info AS hi ON ar.house_id = hi.house_id \
    LEFT JOIN house_img AS img ON ar.house_id = img.house_id \
    WHERE ar.landlord_id = ? AND ar.landlord_quitrent ='未退租' \
    GROUP BY ar.house_id \
    ORDER BY add_timestamp DESC;"
    const val = [landlordId,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    let dataList = [];
    for (i=0;i<result.length;i++){
        const buildDate = new Date(Number(result[i].add_timestamp));
        const buildDateYear = buildDate.getFullYear();
        const buildDateMonth = buildDate.getMonth() + 1 < 10 ? "0" + (buildDate.getMonth() + 1) : buildDate.getMonth() + 1 ;
        const buildDateDate = buildDate.getDate() < 10 ? "0" + buildDate.getDate() : buildDate.getDate();
        const fullDate = buildDateYear+"-"+buildDateMonth+"-"+buildDateDate
        let data = {
            houseId:result[i].house_id,
            imgUrl:result[i].img_url,
            houseName:result[i].house_name,
            rentPrice:result[i].rent_price,
            buildDate:fullDate,
            tenantName:result[i].tenant_name
        }
        dataList.push(data)
    }
    return res.json({data:dataList})
}

const getNotRentList = async(req,res) =>{
    const email = req.session.user;
    const landlordId = await _getLandlordId(email)
    const sql = "SELECT housing_info.house_id,img_url,house_name,rent_price,insert_timestamp,count_num \
    FROM housing_info \
    JOIN housing_contact ON housing_contact.house_id = housing_info.house_id \
    JOIN house_img ON housing_info.house_id = house_img.house_id \
    LEFT JOIN (SELECT house_id,COUNT(list_id) AS count_num FROM reserve_list GROUP BY house_id) as rentcount ON housing_info.house_id = rentcount.house_id \
    WHERE rental_status = ? AND member_id = ? \
    GROUP BY housing_info.house_id \
    ORDER BY insert_timestamp DESC;"
    const val = ["未出租",landlordId];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    let dataList = [];
    for (i=0;i<result.length;i++){
        const buildDate = new Date(result[i].insert_timestamp);
        const buildDateYear = buildDate.getFullYear();
        const buildDateMonth = buildDate.getMonth() + 1 < 10 ? "0" + (buildDate.getMonth() + 1) : buildDate.getMonth() + 1 ;
        const buildDateDate = buildDate.getDate() < 10 ? "0" + buildDate.getDate() : buildDate.getDate();
        const fullDate = buildDateYear+"-"+buildDateMonth+"-"+buildDateDate
        let countNum;
        if (result[i].count_num == null){
            countNum = 0
        } else {
            countNum = result[i].count_num
        }   
        let data = {
            houseId:result[i].house_id,
            imgUrl:result[i].img_url,
            houseName:result[i].house_name,
            rentPrice:result[i].rent_price,
            buildDate:fullDate,
            countNum:countNum
        }
        dataList.push(data)
    }
    return res.json({data:dataList})
}

const _getLandlordId = async(email) =>{
    sql = "SELECT landlord_id FROM landlord_member WHERE landlord_email=?;"
    val = [email,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]==undefined){
        return undefined
    }
    return result[0].landlord_id;
}

const getLandlordReserveList = async(req,res)=>{
    const houseId = req.query.house;
    sql = "SELECT list_id,img_url,house_name,reserve_name,reserve_list.tenant_id,tenant_gender,reserve_date,reserve_time,reserve_phone,other_question \
    FROM reserve_list \
    NATURAL JOIN housing_info \
    NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
    LEFT JOIN tenant_member ON reserve_name = tenant_name \
    WHERE reserve_list.house_id = ?;"
    val = [houseId,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]==undefined){
        return res.json({data:null})
    } else {
        let dataList = [];
        for (i=0;i<result.length;i++){
            let callName;
            if (result[i].tenant_gender == "male"){
                callName = "先生"
            } else {
                callName = "小姐"
            }
            let data = {
                reserveId:result[i].list_id,
                imgUrl:result[i].img_url,
                houseName:result[i].house_name,
                tenantId:result[i].tenant_id,
                tenantCall:result[i].reserve_name[0]+callName,
                tenantName:result[i].reserve_name,
                reserveDate:result[i].reserve_date,
                reserveTime:result[i].reserve_time,
                reservePhone:result[i].reserve_phone,
                otherQuestion:result[i].other_question
            }
            dataList.push(data)
        }
        return res.json({data:dataList})
    }
} 

const getTenantRentList = async(req,res)=>{
    const email = req.session.user;
    const tenantId = await _getTenantId(email)
    const sql = "SELECT ar.house_id,house_name,rent_price,add_timestamp,landlord_name,img_url,`status` \
    FROM already_rented AS ar \
    LEFT JOIN landlord_member AS lm ON ar.landlord_id = lm.landlord_id \
    LEFT JOIN housing_info AS hi ON ar.house_id = hi.house_id \
    LEFT JOIN house_img AS img ON ar.house_id = img.house_id \
    LEFT JOIN (SELECT house_id,`status` FROM rentbill_list WHERE `status`='X') AS rs ON ar.house_id= rs.house_id \
    WHERE ar.tenant_id = ? AND ar.tenant_quitrent = '未退租' \
    GROUP BY ar.house_id \
    ORDER BY add_timestamp DESC;"
    const val = [tenantId,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    let billStatus;
    let dataList = [];
    for (i=0;i<result.length;i++){
        const buildDate = new Date(Number(result[i].add_timestamp));
        const buildDateYear = buildDate.getFullYear();
        const buildDateMonth = buildDate.getMonth() + 1 < 10 ? "0" + (buildDate.getMonth() + 1) : buildDate.getMonth() + 1 ;
        const buildDateDate = buildDate.getDate() < 10 ? "0" + buildDate.getDate() : buildDate.getDate();
        const fullDate = buildDateYear+"-"+buildDateMonth+"-"+buildDateDate
        if (result[i].status == null){
            billStatus = "O"
        } else {
            billStatus = "X"
        }
        let data = {
            houseId:result[i].house_id,
            imgUrl:result[i].img_url,
            houseName:result[i].house_name,
            rentPrice:result[i].rent_price,
            buildDate:fullDate,
            landlordName:result[i].landlord_name,
            status:billStatus
        }
        dataList.push(data)
    }
    return res.json({data:dataList})
}

const getTenantReserveList = async(req,res)=>{
    const email = req.session.user;
    const tenantId = await _getTenantId(email)
    sql = "SELECT reserve_list.house_id,img_url,house_name,reserve_date,reserve_time,house_address,rent_price,call_name,contact_cellphone \
    FROM reserve_list \
    NATURAL JOIN housing_info \
    NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
    NATURAL JOIN housing_contact \
    LEFT JOIN tenant_member ON reserve_name = tenant_name \
    WHERE tenant_member.tenant_id = ? ;"
    val = [tenantId,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]==undefined){
        return res.json({data:null})
    } else {
        let dataList = [];
        for (i=0;i<result.length;i++){
            let data = {
                houseId:result[i].house_id,
                imgUrl:result[i].img_url,
                houseName:result[i].house_name,
                reserveDate:result[i].reserve_date,
                reserveTime:result[i].reserve_time,
                houseAddress:result[i].house_address,
                rentPrice:result[i].rent_price,
                landlordCallName:result[i].call_name,
                contactCellphone:result[i].contact_cellphone
            }
            dataList.push(data)
        }
        return res.json({data:dataList})
    }
} 

const _getTenantId = async(email) =>{
    const sql = "SELECT tenant_id FROM tenant_member WHERE tenant_email = ?"
    const val = [email,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    return result[0].tenant_id
}

const deleteReserve = async(req,res)=>{
    const email = req.session.user;
    const tenantId = await _getTenantId(email);
    const sql = "DELETE FROM reserve_list WHERE house_id = ? AND tenant_id= ?;"
    const val = [req.body.houseId,tenantId]
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

const deleteLLReserve = async(req,res)=>{
    const sql = "DELETE FROM reserve_list WHERE list_id = ?;"
    const val = [req.body.listID,]
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

const deleteHouse = async(req,res) =>{
    const deleteReserveSql = "DELETE FROM reserve_list WHERE house_id = ?";
    const deleteHouseImgSql = "DELETE FROM house_img WHERE house_id = ?";
    const deleteRentTagListSql = "DELETE FROM renttag_list WHERE house_id = ?";
    const deleteDetailSql = "DELETE FROM house_detail WHERE house_id = ?";
    const deleteFurnitureSql = "DELETE FROM furniture_list WHERE house_id = ?";
    const deleteEquipment = "DELETE FROM house_equipment WHERE house_id = ?";
    const deleteHouseTagList = "DELETE FROM housetag_list WHERE house_id = ?";
    const deleteHouseInfo = "DELETE FROM housing_info WHERE house_id = ?";
    const deleteHouseContact = "DELETE FROM housing_contact WHERE house_id = ?";
    const val = [req.body.houseId,]
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,deleteReserveSql,val)
        await Pool.query(connection,deleteHouseImgSql,val)
        await Pool.query(connection,deleteRentTagListSql,val)
        await Pool.query(connection,deleteDetailSql,val)
        await Pool.query(connection,deleteFurnitureSql,val)
        await Pool.query(connection,deleteEquipment,val)
        await Pool.query(connection,deleteHouseTagList,val)
        await Pool.query(connection,deleteHouseInfo,val)
        await Pool.query(connection,deleteHouseContact,val)
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

const rentOutHouse = async(req,res) =>{
    const email = req.session.user;
    const landlordId = await _getLandlordId(email);
    const timeNow = Date.now();
    const connection = await Pool.getConnection();
    const updateInfoStatusSql = "UPDATE housing_info SET rental_status='已出租' WHERE house_id = ?";
    const updateInfoStatusVal = [req.body.houseID,]
    const insertRentedTableSql = "INSERT INTO already_rented(house_id,landlord_id,tenant_id,add_timestamp) VALUES (?,?,?,?)";
    const insertRentedTableVal = [req.body.houseID,landlordId,req.body.tenantID,timeNow];
    const deleteReserveSql = "DELETE FROM reserve_list WHERE house_id = ?";
    const deleteReserveVal = [req.body.houseID,];
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,updateInfoStatusSql,updateInfoStatusVal)
        await Pool.query(connection,insertRentedTableSql,insertRentedTableVal)
        await Pool.query(connection,deleteReserveSql,deleteReserveVal)
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

const quitRent = async(req,res) =>{
    const email = req.session.user;
    const houseId = req.body.houseId;
    const val = [houseId,];
    const landlordIdResult = await _getLandlordId(email);
    if (landlordIdResult != undefined){
        //房東處理
        const updateQuitRentSql = "UPDATE already_rented SET landlord_quitrent='已退租' WHERE house_id = ?";
        const connection = await Pool.getConnection();
        try{
            await Pool.beginTransaction(connection);
            await Pool.query(connection,updateQuitRentSql,val)
            await Pool.commit(connection);
        } catch(err){
            await Pool.rollback(connection,err);
        }
    } else {
        //房客處理
        const updateQuitRentSql = "UPDATE already_rented SET tenant_quitrent='已退租' WHERE house_id = ?";
        const connection = await Pool.getConnection();
        try{
            await Pool.beginTransaction(connection);
            await Pool.query(connection,updateQuitRentSql,val)
            await Pool.commit(connection);
        } catch(err){
            await Pool.rollback(connection,err);
        }
    }
    //確認狀態，刪除租屋過程相關紀錄
    const deleteStatus = await _deleteRentRecord(houseId);
    return res.json(deleteStatus)
}

const _deleteRentRecord = async(houseId) =>{
    const selectStatusSql = "SELECT landlord_quitrent,tenant_quitrent FROM already_rented WHERE house_id = ?";
    const val = [houseId,]
    const connection2 = await Pool.getConnection();
    const result = await Pool.query(connection2,selectStatusSql,val)
    if (result[0].landlord_quitrent=="已退租" && result[0].tenant_quitrent=="已退租"){
        const deleteRentedSql = "DELETE FROM already_rented WHERE house_id = ?";
        const deleteBillRecordSql = "DELETE FROM rentbill_list WHERE house_id = ?";
        const updateStatusSql = "UPDATE housing_info SET rental_status='未出租' WHERE house_id = ?";
        const connection = await Pool.getConnection();
        try{
            await Pool.beginTransaction(connection);
            await Pool.query(connection,deleteRentedSql,val)
            await Pool.query(connection,deleteBillRecordSql,val)
            await Pool.query(connection,updateStatusSql,val)
            await Pool.commit(connection);
        } catch(err){
            await Pool.rollback(connection,err);
        }
        return {ok:true,msg:"delete ok"}
    } else {
        return {ok:true,msg:"wait"}
    }
}

const getAccountAmountApi = async(req,res)=>{
    const email = req.session.user;
    const landlordId = await _getLandlordId(email);
    const sql = "SELECT account_amount, landlord_name \
    FROM landlord_account \
    NATURAL JOIN landlord_member \
    WHERE landlord_id = ? ;"
    const val = [landlordId, ]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    const data = {
        amount: result[0].account_amount,
        landlordName: result[0].landlord_name
    }
    return res.json({data:data})
}

const insertGetMoney = async(req,res) =>{
    const email = req.session.user;
    const landlordId = await _getLandlordId(email);
    const updateAmountSql = "UPDATE landlord_account SET account_amount = ? WHERE landlord_id = ?";
    const updateAmountVal = [req.body.balance,landlordId];
    const insertSql = "INSERT INTO landlord_getmoney(landlord_id,get_money,bank_username,bank_number,bank_account,actual_money,insert_date) VALUES(?,?,?,?,?,?,?)";
    const insertVal = [landlordId,req.body.getMoney,req.body.bankUsername,req.body.bankNum,req.body.bankAccount,req.body.actualMoney,req.body.dateNow];
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,updateAmountSql,updateAmountVal)
        await Pool.query(connection,insertSql,insertVal)
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

module.exports = {
    getRentList:getRentList,
    getNotRentList : getNotRentList,
    getLandlordReserveList:getLandlordReserveList,
    getTenantReserveList:getTenantReserveList,
    getTenantRentList:getTenantRentList,
    deleteReserve:deleteReserve,
    deleteHouse:deleteHouse,
    deleteLLReserve:deleteLLReserve,
    rentOutHouse:rentOutHouse,
    quitRent:quitRent,
    getAccountAmountApi:getAccountAmountApi,
    insertGetMoney:insertGetMoney
};