let express = require('express');
let userFunction = require('../function/userFunction');

let router = express.Router();

// sign in
router.post('/signin', function(request, response) {

    let email = request.body.email;
    let pw = request.body.pw;
    let data = 'dummy data';

    userFunction.login(email, pw, data, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

// sign up
router.post('/signup', function(request, response) {

    let email = request.body.email;
    let pw = request.body.pw;
    let name = request.body.name;

    userFunction.signup(email, pw, name, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

// get user info
router.post('/info', function (request, response) {

    let token = request.body.token;

    userFunction.info(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

module.exports = router;
