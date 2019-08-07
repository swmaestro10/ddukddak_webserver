let module_db = require('../modules/mysql_connect');

function checkLogin(email, pw, callback) {

    module_db.executeDB(`SELECT * FROM user WHERE email = '${email}' AND password = '${pw}'`, function(result){

        let data = JSON.parse( JSON.stringify(result) );

        if(data.length > 0) callback(data[0].id, data[0].name, data[0].subscription, data[0].server);
        else callback(null, null);

    });

}

module.exports = {

    login : function(request, callback) {

        let email = request.body.email;
        let pw = request.body.pw;

        checkLogin(email, pw, function(id, name, subscription, server) {

            if(id === null) callback(JSON.parse( `[ { "login":0 } ]` ));
            else callback(JSON.parse( `[ { "login":1, "id":${id}, "name":"${name}", "subscription":"${subscription}", "server":"${server}" } ]` ));

        });

    },

    checkLogin : checkLogin

};
