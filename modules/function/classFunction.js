let fs = require('fs');
let requestSend = require('request');
let socketClient = require('socket.io-client');
let mysqlConnector = require('../mysqlConnector');
let userFunction = require('./userFunction');
let globalFunction = require('./globalFunction');
let queryConfig = require('../../config/query.json');

function getClass(classs, callback) {

    let query_info = globalFunction.evalTemplate(globalFunction.makeTemplate(queryConfig.get_class_info), {classs : classs});

    mysqlConnector.executeDB(query_info, function(result){

        let json_class = JSON.parse( JSON.stringify(result) );

        if(json_class.length > 0) callback( JSON.stringify(json_class) );
        else callback(null);

    });

}

function getAllClass(callback) {

    let query_all = queryConfig.get_all_class;

    mysqlConnector.executeDB(query_all, function(result){

        let json_class_all = JSON.parse( JSON.stringify(result) );

        if(json_class_all.length > 0) callback( JSON.stringify(json_class_all) );
        else callback(null);

    });

}

function getMyList(user, callback) {

    let query_my = globalFunction.evalTemplate(globalFunction.makeTemplate(queryConfig.get_my_class), {user : user});

    mysqlConnector.executeDB(query_my, function(result){

        let json_class_my = JSON.parse( JSON.stringify(result) );
        if(json_class_my.length === 0) callback(null);

        let json_result_string = '[ ';

        getAllClass(function (json_class_data) {

            for(let i = 0; i < json_class_my.length; i++) {

                let now = json_class_my[i];
                let class_id = now.class;
                let class_percent = now.percent;

                let json_class_all = JSON.parse( json_class_data );

                for(let j = 0; j < json_class_all.length; j++) {

                    if(json_class_all[j].id === class_id) {

                        let class_name = json_class_all[j].name;

                        if(i === json_class_my.length - 1) {

                            json_result_string += `{ "class" : ${class_id}, "name" : "${class_name}", "percent" : ${class_percent} } ]`;

                            callback(json_result_string);

                        } else json_result_string += `{ "class" : ${class_id}, "name" : "${class_name}", "percent" : ${class_percent} }, `;

                        break;

                    }

                }

            }

        });

    });

}

function enterClass(user, classs, callback) {

    let query_info = globalFunction.evalTemplate(globalFunction.makeTemplate(queryConfig.get_class_info), {classs : classs});
    let query_subclass_of_parent = globalFunction.evalTemplate(globalFunction.makeTemplate(queryConfig.get_subclass_of_parent), {classs : classs});

    mysqlConnector.executeDB(query_info, function(result){

        let json_class = JSON.parse( JSON.stringify(result) );

        if(json_class.length > 0) {

            mysqlConnector.executeDB(query_subclass_of_parent, function (result) {

                let json_subclass = JSON.parse( JSON.stringify(result) );

                callback( `[ ${JSON.stringify(json_class[0])}, ${JSON.stringify(json_subclass)} ]` );

            });

        }
        else callback(null);

    });

}

function getSubClass(subclass, callback) {

    let query_subclass_info = globalFunction.evalTemplate(globalFunction.makeTemplate(queryConfig.get_subclass_info), {subclass : subclass});

    mysqlConnector.executeDB(query_subclass_info, function(result){

        let json_subclass = JSON.parse( JSON.stringify(result) );

        if(json_subclass.length > 0) callback( JSON.stringify(json_subclass) );
        else callback(null);

    });

}

function submitCode(user, subclass, code, socket_front) {

    if(subclass === 3) { // mnist

        let socket = socketClient.connect('http://gpu.ddukddak.io:8801/code', {reconnect: true});

        socket.on('response', function (json) {

            if(json !== undefined) {

                // about connection
                if(json.data === 0) { // connected

                    if(json.status === 1) {

                        socket.emit('start', {'sessionId':user});

                        socket.emit('run', {'code':code});

                    } else if(json.status === 2) { // close connection

                        socket_front.emit('result', {'text':'DONE!'});

                        console.log('DONE!');

                        socket.close();

                    }

                } else if(json.data === 1) { // about log

                    socket_front.emit('result', {'text':json.text});

                } else if(json.data === 2) { // about result

                    socket_front.emit('result', {'text':json.result});

                }

            }

        });

    }

}

module.exports = {

    class : function (id, callback) {

        getClass(id, function (json_class_string) {

            callback( JSON.parse(json_class_string) );

        });

    },

    my : function (token, callback) {

        userFunction.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                getMyList(json_login.id, function (json_result_string) {

                    callback( JSON.parse(json_result_string) );

                });

            }

        });

    },

    all : function (token, callback) {

        userFunction.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                getAllClass(function (json_result_string) {

                    callback( JSON.parse(json_result_string) );

                });

            }

        });

    },

    enter : function (token, classs, callback) {

        userFunction.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                enterClass(json_login.id, classs, function (json_result_string) {

                    callback( JSON.parse(json_result_string) );

                });

            }

        });

    },

    subclass : function (id, callback) {

        getSubClass(id, function (json_subclass_string) {

            callback( JSON.parse(json_subclass_string) );

        });

    },

    submit : function (token, subclass, code, socket_front) {

        userFunction.tokenCheck(token, function (json_login) {

            if(json_login.id === null) console.log( JSON.parse( `{ "login":0 }` ) );
            else submitCode(json_login.id, subclass, code, socket_front);

        });

    },

    submitImage : function (file, style, callback) {

        fs.readFile(`./uploads/${file}`, (err, data) => {

            requestSend({

                method: 'POST',
                url: 'http://gpu.ddukddak.io:8802/run',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'Content-Type': 'application/json'
                    },
                body:
                    {
                        style : style,
                        image: data.toString('base64')
                    },
                json: true

            }, function (error, res, body) {

                if (error) throw new Error(error);

                callback(body);

            });

        });

    }

};
