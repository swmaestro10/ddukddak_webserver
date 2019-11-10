let mysql = require('mysql');
let db_config = require('../config/db.json');

let connection = mysql.createConnection({
    host     : db_config.HOST,
    port     : db_config.PORT,
    user     : db_config.USER,
    password : db_config.PW,
    database : db_config.NAME
});

module.exports = {

    startDB : function (callback){

        connection.connect();

    },

    endDB : function (){

        connection.end();

    },

    executeDB : function (db_query, callback){

        connection.query(db_query, function (error, results, fields) {

            if (error) console.log(error);

            callback(results);

        });

    }

};
