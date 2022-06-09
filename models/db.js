const mysql = require('mysql');
require('dotenv').config({path:process.cwd()+"/config/.env"})

const connectionPool = mysql.createPool({
    host:process.env.RDS_HOSTNAME,
    user:process.env.RDS_USERNAME,
    password:process.env.RDS_PASSWORD,
    port:process.env.RDS_PORT,
    database:process.env.RDS_DB_NAME
})

const getConnection = () =>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,connection)=>{
            if(err){
                reject(err);
            } else {
                resolve(connection);
            }
        })
    })
}

const beginTransaction = (connection) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
        }})
    });
}

const query = (connection,sql, value) => {
    return new Promise((resolve, reject) => {
        if (sql.includes("SELECT")){
            connection.query(sql, value, (err,results) => {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
            }});
        } else {
            connection.query(sql, value, (err,results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
            }});
        }
    });
}

const commit = (connection) => {
    return new Promise((resolve, reject) => {
        connection.commit((err) => {
            connection.release();
            if (err) {
                reject(err);
            } else {
                resolve();
        }});
    });
};

const rollback = (connection,err) => {
    return new Promise((resolve, reject) => {
        connection.rollback(() => {
            connection.release();
            reject(err);
        });
    });
};

module.exports = {
    getConnection:getConnection,
    beginTransaction: beginTransaction,
    query: query,
    commit: commit,
    rollback: rollback,
  };
