let aes256 = require('aes256');
let module_db = require('../modules/mysql_connect');
let g_function = require('../modules/function_global');
let aes_config = require('../config/aes.json');
let query_config = require('../config/query.json');

let query_login_template = "`" + query_config.check_login + "`";
let query_info_template = "`" + query_config.get_info + "`";

function checkLogin(email, pw, callback) {

    let query_login = g_function.eval_template(query_login_template, {email : email, pw : pw});

    module_db.executeDB(query_login, function(result) {

        let json_login = JSON.parse( JSON.stringify(result) );

        if(json_login.length > 0) callback( json_login[0].id );
        else callback(null);

    });

}

function getInfo(id, callback) {

    let query_info = g_function.eval_template(query_info_template, {id : id});

    module_db.executeDB(query_info, function(result) {

        if(result.length > 0) callback( JSON.stringify(result[0]) );
        else callback(null);

    });

}

function encryptToken(email, pw, data, callback) {

    let json_token_string =
        `{ 
        "${Math.random()}":"${Math.random()}", 
        "email":"${email}", 
        "${Math.random()}":"${Math.random()}", 
        "pw":"${pw}", 
        "${Math.random()}":"${Math.random()}", 
        "data":"${data}", 
        "${Math.random()}":"${Math.random()}" 
        }`;
    let encrypted = aes256.encrypt(aes_config.KEY, json_token_string);
    callback(encrypted);

}

function decryptToken(encrypted, callback) {

    let decrypted = aes256.decrypt(aes_config.KEY, encrypted);
    let decrypted_json = JSON.parse(decrypted);
    callback(decrypted_json);

}

module.exports = {

    login : function(request, callback) {

        let email = request.body.email;
        let pw = request.body.pw;
        let data = 'dddddddddd';

        checkLogin(email, pw, function(id) {

            if(id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                encryptToken(email, pw, data, function(token) {

                    callback( JSON.parse( `{ "login":1, "token":"${token}" }` ) );

                });

            }

        });

    },

    info : function(token, callback) {

        this.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                getInfo(json_login.id, function (json_info){

                    callback( JSON.parse( `[ { "login":1 }, ${json_info} ]` ) );

                });

            }

        });

    },

    tokenCheck : function(token, callback) {

        decryptToken(token, function (json_token) {

            let email = json_token.email;
            let pw = json_token.pw;
            let data = json_token.data;

            checkLogin(email, pw, function(id) {

                if(id === null) callback( JSON.parse( `{ "login":0 }` ) );
                else callback( JSON.parse( `{ "login":1, "id":${id} }` ) );

            });

        });

    }

};
