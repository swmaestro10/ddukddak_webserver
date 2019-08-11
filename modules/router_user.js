let express = require('express');
let user_function = require('./function_user');

let router = express.Router();

router.get('/login', function(request, response) {

    user_function.login(request, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

router.get('/info', function (request, response) {

    let token = request.body.token;

    user_function.info(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

module.exports = router;
