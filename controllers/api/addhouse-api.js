const Pool  = require('../../models/db');
const { uploadFile } = require('../../models/connectS3')
require('dotenv').config({path:process.cwd()+"/config/.env"});
const multer = require('multer');

const upload = multer({
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)){
            req.fileValidationError = "Image Error";
            return cb(null,false,req.fileValidationError);
        }
        cb(null,true);
    }
});

const addhouseApi = async(req,res)=>{
    const resultId = await _selectLandlordId(req.session.user)
    const houseId = "H"+_createId();
    const connection = await Pool.getConnection();
    if (req.files.length == 0){
        return res.json({error:true,msg:"請務必加入一張圖片"})
    }
    try{
        await Pool.beginTransaction(connection);
        await _insertHousePerson(connection,req.body,houseId,resultId);
        await _insertHouseInfo(connection,req.body,houseId);
        await _insertHouseTag(connection,req.body.housetag,houseId);
        await _insertHouseEquipement(connection,req.body,houseId);
        await _insertFurnitureTag(connection,req.body.furnituretag,houseId);
        await _insertHouseDetail(connection,req.body,houseId);
        await _insertRentTag(connection,req.body.renttag,houseId);
        await _insertHouseImg(connection,req.files,houseId);
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true,houseId:houseId})
}

const _selectLandlordId= async(email) => {
    const connection = await Pool.getConnection();
    const selectIdSql = "SELECT landlord_id FROM landlord_member WHERE landlord_email = ?";
    const selectIdVal = [email,];
    const result = await Pool.query(connection,selectIdSql,selectIdVal)
    return result[0].landlord_id
}

const _createId = () => {
    const rawPre = (Date.now()-new Date(1652098249212).getTime()) / 1000 ;  
    const preNumber = Number(rawPre.toFixed()) * 1000; 
    const randam = Math.floor(Math.random() * 1000);
    const eightNum = String(preNumber+randam).slice(-8)
    return eightNum
}

const _insertHousePerson = async(connection,data,houseId,landlordId) =>{ 
    const sqlIn = "INSERT INTO housing_contact VALUES (?,?,?,?,?,?);"
    const valueIn = [houseId,landlordId,data.responsiblePerson,data.firstName+data.gender,data.cellphone,data.newHouseEmail]
    await Pool.query(connection,sqlIn,valueIn);
}

const _insertHouseInfo = async(connection,data,houseId) =>{
    let rentMonth = _checkDataUndefined(data.rentMonth);
    let rentMoney = _checkDataUndefined(data.rentMoney);
    let managementPrice = _checkDataUndefined(data.managementPrice);
    let todayStamp = Date.now();
    const sqlIn = "INSERT INTO housing_info VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
    const valueIn = [houseId,data.houseTitleName,data.selectHouseCity, 
        data.newHouseAddress,data.buildingType,data.roomType,data.pingNumber,data.houseFloor,
        data.roomNum,data.livingroomNum,data.bathroomNum,data.rentPrice,data.houseDeposit,
        rentMonth,rentMoney,data.managementFee,managementPrice,todayStamp,'未出租'];
    await Pool.query(connection,sqlIn,valueIn);
}

const _checkDataUndefined = (data)=>{
    if (data == undefined || data == 0){
        return "-"
    } else {
        return data
    }
}

const _insertHouseTag = async(connection,data,houseId) => {
    if (data != null){
        for (i=0; i<data.length;i++){
            const sqlIn = "INSERT INTO housetag_list(house_id,tag_id) VALUES (?,?);"
            const valueIn = [houseId,data[i]]
            await Pool.query(connection,sqlIn,valueIn)
        }
    } else {
        const sqlIn = "INSERT INTO housetag_list(house_id,tag_id) VALUES (?,?);"
        const valueIn = [houseId,15]
        await Pool.query(connection,sqlIn,valueIn)
    }
}

const _insertHouseEquipement = async(connection,data,houseId) =>{
    let otherLimit = _checkDataUndefined(data.otherLimit);
    const sqlIn = "INSERT INTO house_equipment VALUES (?,?,?,?,?,?)";
    const valIn = [houseId,data.rentYear,data.cooking,data.pet,data.rentLimit,otherLimit];
    await Pool.query(connection,sqlIn,valIn);
}

const _insertFurnitureTag = async(connection,data,houseId)=>{
    if (data != null){
        for (i=0; i<data.length;i++){
            const sqlIn = "INSERT INTO furniture_list(house_id,furniture_tag_id) VALUES (?,?);"
            const valueIn = [houseId,data[i]];
            await Pool.query(connection,sqlIn,valueIn);
        }
    } else {
        const sqlIn = "INSERT INTO furniture_list(house_id,furniture_tag_id) VALUES (?,?);"
        const valueIn = [houseId,16];
        await Pool.query(connection,sqlIn,valueIn);
    }
}

const _insertHouseDetail = async(connection,data,houseId)=>{
    const sqlIn = "INSERT INTO house_detail VALUES (?,?,?,?,?,?)";
    const valueIn = [houseId,data.houseRights,data.houseDirection,data.conditions,data.houseArea,data.commentArea];
    await Pool.query(connection,sqlIn,valueIn);
}

const _insertRentTag = async(connection,data,houseId) =>{
    if (data != null){
        for (i=0; i<data.length;i++){
            const sqlIn = "INSERT INTO renttag_list(house_id,renttag_id) VALUES (?,?);"
            const valueIn = [houseId,data[i]];
            await Pool.query(connection,sqlIn,valueIn);
        }
    } else {
        const sqlIn = "INSERT INTO renttag_list(house_id,renttag_id) VALUES (?,?);"
        const valueIn = [houseId,9];
        await Pool.query(connection,sqlIn,valueIn);
    }
}

const _insertHouseImg = async(connection,imgs,houseId)=>{
    for (i=0;i<imgs.length;i++){
        const result = await uploadFile(imgs[i]);
        const imgUrl = "https://d1z57eqg63py49.cloudfront.net/"+result.Key;
        const sql = "INSERT INTO house_img(house_id,img_url) VALUES(?,?)";
        const val = [houseId,imgUrl];
        await Pool.query(connection,sql,val);
    }
}

const getHouseInfo = async(req,res)=>{
    const houseId = req.query.houseId
    const sql = "SELECT contact_person,call_name,contact_cellphone,contact_email,house_name,house_tag,house_city,house_address,building_type,ping_number,room_type,house_floor,room_num,livingroom_num,bathroom_num,rent_price,house_deposit,deposit_month,deposit_price,management_fee,management_price,shortest_time,cooking,pet,rent_limit,rentother_limit,house_rights,house_direction,house_use,house_area,remark,furniture_tag,rent_tag \
    FROM housing_contact \
    NATURAL JOIN housing_info \
    NATURAL JOIN house_equipment \
    NATURAL JOIN house_detail \
    NATURAL JOIN (SELECT house_id,GROUP_CONCAT(tag_id) AS house_tag FROM housetag_list GROUP BY house_id) AS tag_list \
    NATURAL JOIN (SELECT house_id,GROUP_CONCAT(furniture_tag_id) AS furniture_tag FROM furniture_list GROUP BY house_id) AS furniture \
    NATURAL JOIN (SELECT house_id,GROUP_CONCAT(renttag_id) AS rent_tag FROM renttag_list GROUP BY house_id) AS renttag \
    WHERE house_id = ?;"
    const val = [houseId,]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val)
    const data = {
        contactPerson : result[0].contact_person,
        firstName: (result[0].call_name)[0],
        gerder: (result[0].call_name)[1]+(result[0].call_name)[2],
        phone:result[0].contact_cellphone,
        email:result[0].contact_email,
        houseTitle:result[0].house_name,
        houseTag:(result[0].house_tag).split(','),
        city:result[0].house_city,
        address:result[0].house_address,
        building:result[0].building_type,
        roomType:result[0].room_type,
        pingNumber:result[0].ping_number,
        houseFloor:result[0].house_floor,
        roomNum:result[0].room_num,
        livingroomNum:result[0].livingroom_num,
        bathroomNum:result[0].bathroom_num,
        rentPrice:result[0].rent_price,
        deposit:result[0].house_deposit,
        depositMonth:result[0].deposit_month,
        depositPrice:result[0].deposit_price,
        managementFee:result[0].management_fee,
        managementPrice:result[0].management_price,
        shortestMonth:result[0].shortest_time,
        cooking:result[0].cooking,
        pet:result[0].pet,
        rentLimit:result[0].rent_limit,
        rentotherLimit:result[0].rentother_limit,
        houseRights:result[0].house_rights,
        houseDirection:result[0].house_direction,
        houseUse:result[0].house_use,
        houseArea:result[0].house_area,
        remark:result[0].remark,
        furnitureTag:(result[0].furniture_tag).split(','),
        rentTag:(result[0].rent_tag).split(',')
    }
    return res.json({data:data})
} 

const updateHouse = async(req,res)=>{
    const houseId = req.body.houseId;
    const reqData = req.body.data;
    let rentMonth = _checkDataUndefined(reqData.rentMonth);
    let rentMoney = _checkDataUndefined(reqData.rentMoney);
    let managementPrice = _checkDataUndefined(reqData.managementPrice);
    let otherLimit = _checkDataUndefined(reqData.otherLimit);
    const contactSql = "UPDATE housing_contact SET contact_person = ?, call_name = ?, contact_cellphone = ?, contact_email = ? WHERE house_id = ?";
    const contactVal = [reqData.responsiblePerson,reqData.firstName+reqData.gender,reqData.cellphone,reqData.newHouseEmail,houseId];
    const infoSql = "UPDATE housing_info SET house_name = ?, house_city = ?, house_address = ?, building_type = ?, room_type = ?, ping_number = ?, house_floor = ?, room_num = ?, livingroom_num = ?, bathroom_num = ?, rent_price = ?, house_deposit = ?, deposit_month = ?, deposit_price = ?, management_fee = ?, management_price = ? WHERE house_id = ?"
    const infoVal = [reqData.houseTitleName,reqData.selectHouseCity,reqData.newHouseAddress,reqData.buildingType,reqData.roomType,reqData.pingNumber,reqData.houseFloor,reqData.roomNum,reqData.livingroomNum,reqData.bathroomNum,reqData.rentPrice,reqData.houseDeposit,rentMonth,rentMoney,reqData.managementFee,managementPrice,houseId]
    const equipmentSql = "UPDATE house_equipment SET shortest_time = ?, cooking = ?, pet = ?, rent_limit = ?, rentother_limit = ? WHERE house_id = ? ";
    const equipmentVal = [reqData.rentYear,reqData.cooking,reqData.pet,reqData.rentLimit,otherLimit,houseId];
    const detailSql = "UPDATE house_detail SET house_rights = ?, house_direction = ?, house_use = ?, house_area = ?, remark = ? WHERE house_id = ? ";
    const detailVal = [reqData.houseRights,reqData.houseDirection,reqData.conditions,reqData.houseArea,reqData.commentArea,houseId];
    const deletehouseTagSql = "DELETE FROM housetag_list WHERE house_id = ?";
    const deleteFurnitureSql = "DELETE FROM furniture_list WHERE house_id = ?";
    const deleteRentTagSql = "DELETE FROM renttag_list WHERE house_id = ?";
    const val = [houseId,]
    const connection = await Pool.getConnection();
    try{
        await Pool.beginTransaction(connection);
        await Pool.query(connection,deletehouseTagSql,val);
        await Pool.query(connection,deleteFurnitureSql,val);
        await Pool.query(connection,deleteRentTagSql,val);
        await Pool.query(connection,contactSql,contactVal);
        await Pool.query(connection,infoSql,infoVal);
        await Pool.query(connection,equipmentSql,equipmentVal);
        await Pool.query(connection,detailSql,detailVal);
        await _insertHouseTag(connection,reqData.houseTag,houseId);
        await _insertFurnitureTag(connection,reqData.furnituretag,houseId);
        await _insertRentTag(connection,reqData.renttag,houseId);
        await Pool.commit(connection);
    } catch(err){
        await Pool.rollback(connection,err);
    }
    return res.json({ok:true})
}

module.exports ={
    upload,
    addhouseApi,
    getHouseInfo,
    updateHouse
}