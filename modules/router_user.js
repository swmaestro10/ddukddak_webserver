let express = require('express');
let user_function = require('./function_user');

let router = express.Router();

router.post('/signin', function(request, response) {

    let email = request.body.email;
    let pw = request.body.pw;
    let data = 'dddddddddd';

    user_function.login(email, pw, data, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

router.post('/signup', function(request, response) {

    let email = request.body.email;
    let pw = request.body.pw;
    let name = request.body.name;

    user_function.signup(email, pw, name, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

router.post('/info', function (request, response) {

    let token = request.body.token;

    user_function.info(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

module.exports = router;
