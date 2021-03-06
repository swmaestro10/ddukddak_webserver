let aes256 = require('aes256');
let mysqlConnector = require('../mysqlConnector');
let globalFunction = require('./globalFunction');
let aesConfig = require('../../config/aes.json');
let queryConfig = require('../../config/query.json');

// templates for db query
let loginQueryTemplate = globalFunction.makeTemplate(queryConfig.check_login);
let signupQueryTemplate = globalFunction.makeTemplate(queryConfig.create_user);
let infoQueryTemplate = globalFunction.makeTemplate(queryConfig.get_info);

function checkLogin(email, pw, callback) {

    let loginQuery = globalFunction.evalTemplate(loginQueryTemplate, {email : email, pw : pw});

    mysqlConnector.executeDB(loginQuery, function(result) {

        let json_login = JSON.parse( JSON.stringify(result) );

        if(json_login.length > 0) callback( json_login[0].id );
        else callback(null);

    });

}

function createUser(email, pw, name, callback) {

    let signupQuery = globalFunction.evalTemplate(signupQueryTemplate, {email : email, pw : pw, name : name});

    mysqlConnector.executeDB(signupQuery, function(result) {

        callback( 1 );

    });

}

function getInfo(id, callback) {

    let infoQuery = globalFunction.evalTemplate(infoQueryTemplate, {id : id});

    mysqlConnector.executeDB(infoQuery, function(result) {

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
    let encrypted = aes256.encrypt(aesConfig.KEY, json_token_string);
    callback(encrypted);

}

function decryptToken(encrypted, callback) {

    let decrypted = aes256.decrypt(aesConfig.KEY, encrypted);
    let decrypted_json = JSON.parse(decrypted);
    callback(decrypted_json);

}

module.exports = {

    login : function(email, pw, data, callback) {

        checkLogin(email, pw, function(id) {

            if(id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                encryptToken(email, pw, data, function(token) {

                    callback( JSON.parse( `{ "login":1, "token":"${token}" }` ) );

                });

            }

        });

    },

    signup : function(email, pw, name, callback) {

        createUser(email, pw, name, function (result) {

            callback( JSON.parse( `{ "ok":${result} }` ) );

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
