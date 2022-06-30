const Pool  = require('../../models/db');

const houseList = async(req,res)=>{
    const city = req.query.city;
    const keyword = req.query.keyword;
    const reqPage = req.query.page;
    const recent = req.query.recent;
    const rentUp = req.query.rentup;
    const roomSum = req.query.roomsum;
    const roomType = req.query.selectRoomType;
    const buildingType = req.query.selectBuildingType;
    const roomTotal = req.query.selectRoomSum;
    let addRoomTypeSql;
    let addBuildingTypeSql;
    let addroomTotalSql;
    if (roomType!="0" && roomType != undefined){
        addRoomTypeSql="room_type = "+ roomType
    } else {
        addRoomTypeSql="room_type IS NOT NULL"
    }
    if (buildingType!="0" && buildingType != undefined){
        addBuildingTypeSql="building_type =  "+ buildingType
    } else {
        addBuildingTypeSql="building_type IS NOT NULL"
    }
    if (roomTotal!="0" && roomTotal != undefined && roomTotal!="5"){
        addroomTotalSql="room_num = "+ roomTotal
    } else if (roomTotal == "5"){
        addroomTotalSql="room_num >= "+ roomTotal
    } else {
        addroomTotalSql="room_num IS NOT NULL"
    }
    const totalAddSql = addRoomTypeSql +" AND "+ addBuildingTypeSql+" AND " + addroomTotalSql
    if (reqPage == 0){
        firstValue = 0
    } else {
        firstValue = Number(reqPage) * 8
    }
    if (city==undefined && keyword==undefined){
        const quantity = await getAllQuantity(totalAddSql);
        const data = await getAllResult(firstValue,recent,rentUp,roomSum,totalAddSql);
        const jsonData = returnData(quantity,data,reqPage);
        return res.json(jsonData)
    } else if (city!=undefined && keyword==undefined){
        const quantity = await getCityLimitCount(city,totalAddSql)
        const data = await getCityLimitResult(city,firstValue,recent,rentUp,roomSum,totalAddSql);
        const jsonData = returnData(quantity,data,reqPage);
        return res.json(jsonData)
    } else if (city==undefined && keyword!=undefined){
        const quantity = await getKeywordLimitCount(keyword,totalAddSql);
        const data = await getKeywordLimitResult(keyword,firstValue,recent,rentUp,roomSum,totalAddSql);
        const jsonData = returnData(quantity,data,reqPage);
        return res.json(jsonData)
    } else {
        const quantity = await getCityKeywordCount(city,keyword,totalAddSql);
        const data = await getCityKeywordResult(city,keyword,firstValue,recent,rentUp,roomSum,totalAddSql);
        const jsonData = returnData(quantity,data,reqPage);
        return res.json(jsonData)
    }
}

async function getAllResult(value,recent,rentUp,roomSum,addsql){
    let sql;
    if (recent == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list "
        + " WHERE " + addsql + " AND rental_status = '未出租' \
        ORDER BY insert_timestamp DESC LIMIT ?,8;";
    } else if (rentUp == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact  \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img  \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list "
        + " WHERE " + addsql + " AND rental_status = '未出租' \
         ORDER BY rent_price LIMIT ?,8;";
    } else if (roomSum == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list "
        + " WHERE " + addsql + " AND rental_status = '未出租' \
         ORDER BY room_num DESC LIMIT ?,8;";
    } else {
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact  \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img  \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list"
        + " WHERE " + addsql + " AND rental_status = '未出租' \
         LIMIT ?,8";
    }
    const connection = await Pool.getConnection();
    const val = [value,]
    const result = await Pool.query(connection,sql,val)
    const houseData = pickData(result);
    return houseData
}

async function getAllQuantity(addsql){
    const sql = "SELECT COUNT(*) AS quantity FROM (SELECT house_id FROM housing_info WHERE "+ addsql +" AND rental_status = '未出租') AS result;";
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,null);
    return result[0].quantity
}

async function getCityLimitResult(city,value,recent,rentUp,roomSum,addsql){
    let sql;
    if (recent=="true"){
        sql="SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact  \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list  \
        WHERE city_name = ? AND "+ addsql + " AND rental_status = '未出租' \
        ORDER BY insert_timestamp DESC LIMIT ?,8;"
    } else if (rentUp == "true"){
        sql="SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact  \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE city_name = ? AND "+ addsql + " AND rental_status = '未出租' \
        ORDER BY rent_price LIMIT ?,8;"
    } else if (roomSum == "true"){
        sql="SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE city_name = ? AND "+ addsql + " AND rental_status = '未出租' \
        ORDER BY room_num DESC LIMIT ?,8;"
    } else {
        sql ="SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list  \
        WHERE city_name = ? AND "+ addsql + " AND rental_status = '未出租' \
        LIMIT ?,8;"
    }
    const val = [city,value]
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    const houseData = pickData(result);
    return houseData
}

async function getCityLimitCount(city_name,addsql){
    const sql = "SELECT COUNT(*) AS quantity FROM (SELECT house_id,city_name FROM housing_info JOIN taiwan_city ON city_id = house_city WHERE "+ addsql +" AND rental_status = '未出租' ) AS result WHERE result.city_name = ?;";
    const val = [city_name,];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    return result[0].quantity
}

async function getKeywordLimitResult(keyword,value,recent,rentUp,roomSum,addsql){
    let sql;
    if (recent == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list  \
        WHERE (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        ORDER BY insert_timestamp DESC LIMIT ?,8;";
    } else if (rentUp == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        ORDER BY rent_price LIMIT ?,8;";
    } else if (roomSum == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        ORDER BY room_num DESC LIMIT ?,8;";
    } else {
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        LIMIT ?,8;";
    }
    const val = [keyword,keyword,value];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    const houseData = pickData(result);
    return houseData
}

async function getKeywordLimitCount(keyword,addsql){
    const sql="SELECT COUNT(*) AS quantity FROM (SELECT house_id,house_name,house_address FROM housing_info WHERE "+ addsql +" AND rental_status = '未出租' ) AS result WHERE locate(?,house_name) or locate(?,house_address);";
    const val = [keyword,keyword];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    return result[0].quantity
}

async function getCityKeywordResult(city,keyword,value,recent,rentUp,roomSum,addsql){
    let sql;
    if (recent=="true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE city_name = ? AND (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        ORDER BY insert_timestamp DESC LIMIT ?,8;"
    } else if(rentUp == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE city_name = ? AND (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        ORDER BY rent_price LIMIT ?,8;"
    } else if(roomSum == "true"){
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE city_name = ? AND (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        ORDER BY room_num DESC LIMIT ?,8;"
    } else {
        sql = "SELECT housing_info.house_id,contact_name,call_name,house_name,room_name,ping_number,house_floor,house_address,room_num,livingroom_num,bathroom_num,tag,rent_price,img_url \
        FROM housing_info \
        JOIN room ON room_type = room_id \
        JOIN taiwan_city ON city_id = house_city \
        NATURAL JOIN (SELECT house_id,contact_name,call_name FROM housing_contact JOIN contact_person ON housing_contact.contact_person = contact_person.contact_id) AS contact \
        NATURAL JOIN (SELECT house_id,img_url FROM house_img GROUP BY house_id) AS img \
        NATURAL JOIN (SELECT house_id,GROUP_CONCAT(housetag_name) as tag FROM housetag_list JOIN housetag ON housetag.housetag_id = housetag_list.tag_id GROUP BY house_id) AS tag_list \
        WHERE city_name = ? AND (locate(?,house_name) or locate(?,house_address)) AND "+ addsql +" AND rental_status = '未出租' \
        LIMIT ?,8;"
    }
    const val = [city,keyword,keyword,value];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    const houseData = pickData(result);
    return houseData
}

async function getCityKeywordCount(city,keyword,addsql){
    const sql="SELECT COUNT(*) AS quantity FROM (SELECT house_id,house_name,house_address,city_name FROM housing_info JOIN taiwan_city ON city_id = house_city WHERE + "+ addsql +" AND rental_status = '未出租' ) AS result WHERE result.city_name = ? AND (locate(?,result.house_name) or locate(?,result.house_address));"
    const val = [city,keyword,keyword];
    const connection = await Pool.getConnection();
    const result = await Pool.query(connection,sql,val);
    return result[0].quantity
}

function pickData(result){
    if (result[0] == undefined){
        return 0
    } else {
        let data = []
        for (i=0;i<result.length;i++){
            const dict = {
                houseId:result[i].house_id,
                contactName:result[i].contact_name,
                callName:result[i].call_name,
                houseName:result[i].house_name,
                roomName:result[i].room_name,
                pingNum:result[i].ping_number,
                houseFloor:result[i].house_floor,
                houseAddress:result[i].house_address,
                housePattren:result[i].room_num+" 房 "+result[i].livingroom_num+" 廳 "+result[i].bathroom_num+" 衛",
                tag:(result[i].tag).split(','),
                rentPrice:result[i].rent_price,
                imgUrl:result[i].img_url
            }
            data.push(dict)
        }
        return data
    }
}

function returnData(quantity,data,reqPage){
    if (quantity == 0){
        return {nextPage:null,count:quantity,data:null}
    } else if (data.length < 8){
        return {nextPage:null,count:quantity,data:data}
    } else {
        let nextPage = Number(reqPage) + 1;
        return {nextPage:nextPage,count:quantity,data:data}
    }
}

module.exports = {
    houseList
}