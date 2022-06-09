const Pool  = require('../../models/db');

const houseInfoApi = async(req,res) =>{
    const houseID = req.params.houseId;
    const topResult = await _selectTopInfo(houseID);
    if (topResult == null){
        return res.json({data:null})
    } 
    const equipmentResult = await _selectEquipment(houseID);
    const detailResult = await _selectHouseDetail(houseID);
    if (topResult== null && equipmentResult == null && detailResult==null){
        return res.json({data:null})
    }
    if (req.session.user){
        const email = req.session.user
        const sql = "SELECT tanant_id,tanant_name FROM tanant_member WHERE tanant_email = ?"
        const val = [email,]
        const connection = await Pool.getConnection();
        const result = await Pool.query(connection,sql,val);
        if (result[0]==undefined){
            return res.json({data:{basicInfo:topResult,equipment:equipmentResult,detail:detailResult}})
        } else if (result[0].tanant_name[0]){
            const getReserveData = await _getReserveData(result[0].tanant_id,houseID)
            return res.json({tanantName:result[0].tanant_name,data:{basicInfo:topResult,equipment:equipmentResult,detail:detailResult},reserve:getReserveData})
        }
    } else {
        return res.json({data:{basicInfo:topResult,equipment:equipmentResult,detail:detailResult}})
    }
}

const _selectTopInfo = async(houseID) =>{
    const sql = "SELECT GROUP_CONCAT(img_url) AS img_list,house_name,tag,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,rent_price,deposit_cn,contact_name,call_name,contact_cellphone \
    FROM housing_info \
    JOIN house_img ON house_img.house_id = housing_info.house_id \
    JOIN room ON room_type = room_id \
    JOIN deposit_control ON deposit_en = deposit_month \
    JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list ON tag_list.house_id = housing_info.house_id \
    JOIN (SELECT house_id,contact_name,call_name,contact_cellphone FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact ON contact.house_id = housing_info.house_id \
    WHERE housing_info.house_id = ? AND rental_status = '未出租' \
    GROUP BY housing_info.house_id; ";
    const val = [houseID,];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]==undefined){
        const data = null
        return data
    } else {
        const data = {       
            houseName:result[0].house_name,
            roomName:result[0].room_name,
            pingNum:result[0].ping_number,
            houseFloor:result[0].house_floor,
            houseAddress:result[0].house_address,
            housePattren:result[0].room_num+" 房 "+result[0].livingroom_num+" 廳 "+result[0].bathroom_num+" 衛",
            rentPrice:result[0].rent_price,
            depositMonth:result[0].deposit_cn,
            contactName:result[0].contact_name,
            callName:result[0].call_name,
            contactCellphone:result[0].contact_cellphone,
            tag:(result[0].tag).split(','),
            img:(result[0].img_list).split(',')
        }
        return data
    }
}

const _selectEquipment = async(houseID)=>{
    const sql = "SELECT shortest_time,cooking_limit.cooking,pet_limit.pet,limit_name,rentother_limit,furniture_name \
    FROM house_equipment \
    JOIN house_limit ON limit_id = rent_limit \
    JOIN cooking_limit ON cooking_limit.okornot_id = house_equipment.cooking \
    JOIN pet_limit ON pet_limit.okornot_id = house_equipment.pet \
    JOIN (SELECT house_id,GROUP_CONCAT(furniture_name)AS furniture_name FROM furniture_list JOIN furniture ON furniture_id = furniture_tag_id GROUP BY house_id) AS fn ON fn.house_id = house_equipment.house_id \
    WHERE house_equipment.house_id = ?;"
    const val = [houseID,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]==undefined){
        const data = null
        return data
    } else {
        const data = {       
            shortestTime:result[0].shortest_time,
            cooking:result[0].cooking,
            pet:result[0].pet,
            limitName:result[0].limit_name,
            otherLimit:result[0].rentother_limit,
            furnitureName:(result[0].furniture_name).split(',')
        }
        return data
    }
}

const _selectHouseDetail = async(houseID) =>{
    const sql = "SELECT rights_name,house_direction,house_use,house_area,rentprice,remark \
    FROM house_detail \
    JOIN rights ON rights_id = house_rights \
    JOIN (SELECT house_id,GROUP_CONCAT(rentprice_name) AS rentprice FROM renttag_list JOIN rentprice_tag ON renttag_id = rentprice_id GROUP BY house_id) AS rentprices ON rentprices.house_id = house_detail.house_id \
    WHERE house_detail.house_id= ? ;"
    const val = [houseID,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]==undefined){
        const data = null
        return data
    } else {
        const data = {       
            houseRights:result[0].rights_name,
            houseDirection:result[0].house_direction,
            houseUse:result[0].house_use,
            houseArea:result[0].house_area,
            rentprices:((result[0].rentprice).split(',')).join(' | '),
            remark:result[0].remark
        }
        return data
    }
}

const reserveApi = async(req,res) =>{
    const email = req.session.user;
    const tanantId = await _getTanantId(email)
    let getOtherQuestion;
    if (req.body.otherQuestion==''){
        getOtherQuestion = '-'
    } else {
        getOtherQuestion = req.body.otherQuestion
    }
    const sql = "INSERT INTO reserve_list(house_id,tanant_id,reserve_name,reserve_date,reserve_time,reserve_phone,other_question) VALUES (?,?,?,?,?,?,?)"
    const val = [req.body.houseId,tanantId,req.body.reserveName,req.body.reserveDate,req.body.reserveTime,req.body.reseverPhone,getOtherQuestion]
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,sql,val);
        await Pool.commit(connection);
    } catch {
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

const _getTanantId = async(email) =>{
    const sql = "SELECT tanant_id FROM tanant_member WHERE tanant_email = ?"
    const val = [email,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    return result[0].tanant_id
}

const _getReserveData = async(tanantID,houseID) =>{
    const sql = "SELECT reserve_date,reserve_time,reserve_phone,other_question FROM reserve_list WHERE tanant_id = ? AND house_id = ?;"
    const val = [tanantID,houseID]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    if (result[0]!= null){
        const reserveData = {
            reserveDate:result[0].reserve_date,
            reserveTime:result[0].reserve_time,
            reservePhone:result[0].reserve_phone,
            otherQuestion:result[0].other_question
        }
        return reserveData
    } else {
        return null
    }
}

const updateReserveApi = async(req,res)=>{
    const email = req.session.user;
    const tanantId = await _getTanantId(email);
    let getOtherQuestion;
    if (req.body.otherQuestion==''){
        getOtherQuestion = '-'
    } else {
        getOtherQuestion = req.body.otherQuestion
    }
    const sql = "UPDATE reserve_list SET reserve_date=?,reserve_time=?,reserve_phone=?,other_question=? WHERE house_id = ? AND tanant_id=? ;"
    const val = [req.body.reserveDate,req.body.reserveTime,req.body.reseverPhone,getOtherQuestion,req.body.houseId,tanantId];
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,sql,val);
        await Pool.commit(connection);
    } catch {
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

module.exports = {
    houseInfoApi:houseInfoApi,
    reserveApi:reserveApi,
    updateReserveApi:updateReserveApi
}