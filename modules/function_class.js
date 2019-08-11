let module_db = require('../modules/mysql_connect');
let user_function = require('./function_user');
let g_function = require('../modules/function_global');
let query_config = require('../config/query.json');

let query_info_template = "`" + query_config.get_class_info + "`";
let query_my_template = "`" + query_config.get_my_class + "`";

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

    }

};
