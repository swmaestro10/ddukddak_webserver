let request_send = require('request');
let module_db = require('../modules/mysql_connect');
let user_function = require('./function_user');
let g_function = require('../modules/function_global');
let query_config = require('../config/query.json');

let query_info_template = "`" + query_config.get_class_info + "`";
let query_my_template = "`" + query_config.get_my_class + "`";
let query_subclass_of_parent_template = "`" + query_config.get_subclass_of_parent + "`";
let query_subclass_info_template = "`" + query_config.get_subclass_info + "`";

function getClass(classs, callback) {

    let query_info = g_function.eval_template(query_info_template, {classs : classs});

    module_db.executeDB(query_info, function(result){

        let json_class = JSON.parse( JSON.stringify(result) );

        if(json_class.length > 0) callback( JSON.stringify(json_class) );
        else callback(null);

    });

}

function getAllClass(callback) {

    let query_all = query_config.get_all_class;

    module_db.executeDB(query_all, function(result){

        let json_class_all = JSON.parse( JSON.stringify(result) );

        if(json_class_all.length > 0) callback( JSON.stringify(json_class_all) );
        else callback(null);

    });

}

function getMyList(user, callback) {

    let query_my = g_function.eval_template(query_my_template, {user : user});

    module_db.executeDB(query_my, function(result){

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

    let query_info = g_function.eval_template(query_info_template, {classs : classs});
    let query_subclass_of_parent = g_function.eval_template(query_subclass_of_parent_template, {classs : classs});

    module_db.executeDB(query_info, function(result){

        let json_class = JSON.parse( JSON.stringify(result) );

        if(json_class.length > 0) {

            module_db.executeDB(query_subclass_of_parent, function (result) {

                let json_subclass = JSON.parse( JSON.stringify(result) );

                callback( `[ ${JSON.stringify(json_class[0])}, ${JSON.stringify(json_subclass)} ]` );

            });

        }
        else callback(null);

    });

}

function getSubClass(subclass, callback) {

    let query_subclass_info = g_function.eval_template(query_subclass_info_template, {subclass : subclass});

    module_db.executeDB(query_subclass_info, function(result){

        let json_subclass = JSON.parse( JSON.stringify(result) );

        if(json_subclass.length > 0) callback( JSON.stringify(json_subclass) );
        else callback(null);

    });

}

function submitCode(user, subclass, code, callback) {

    let host = '';
    if(subclass === 1) host = 'http://gpu.ddukddak.io:8801/run';

    request_send({

        uri: host,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        form: {
            code: code
        }

    }, function (err, res, body) {

        if(err) console.log(err);

        callback( `{ "result" : "${body}" }` )

    });

}

module.exports = {

    class : function (id, callback) {

        getClass(id, function (json_class_string) {

            callback( JSON.parse(json_class_string) );

        });

    },

    my : function (token, callback) {

        user_function.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                getMyList(json_login.id, function (json_result_string) {

                    callback( JSON.parse(json_result_string) );

                });

            }

        });

    },

    all : function (token, callback) {

        user_function.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                getAllClass(function (json_result_string) {

                    callback( JSON.parse(json_result_string) );

                });

            }

        });

    },

    enter : function (token, classs, callback) {

        user_function.tokenCheck(token, function (json_login) {

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

    submit : function (token, subclass, code, callback) {

        user_function.tokenCheck(token, function (json_login) {

            if(json_login.id === null) callback( JSON.parse( `{ "login":0 }` ) );
            else {

                submitCode(json_login.id, subclass, code, function (json_result_string) {

                    callback( JSON.parse(json_result_string) );

                });

            }

        });

    }

};
