let express = require('express');
let class_function = require('./function_class');

let router = express.Router();

router.get('/id/:id', function (request, response) {

    let id = request.params.id;

    class_function.class(id, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

router.get('/my', function (request, response) {

    let token = request.body.token;

    class_function.my(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

module.exports = router;
