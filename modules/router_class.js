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

router.post('/my', function (request, response) {

    let token = request.body.token;

    class_function.my(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

router.post('/all', function (request, response) {

    let token = request.body.token;

    class_function.all(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

router.post('/enter', function (request, response) {

    let token = request.body.token;
    let classs = request.body.class;

    class_function.enter(token, classs, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

router.get('/sub/id/:id', function (request, response) {

    let id = request.params.id;

    class_function.subclass(id, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

router.post('/sub/submit', function (request, response) {

    let token = request.body.token;
    let subclass = request.body.subclass;
    let code = request.body.code;

    class_function.submit(token, subclass, code, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

module.exports = router;
