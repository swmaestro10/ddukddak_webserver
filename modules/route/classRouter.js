let express = require('express');
let classFunction = require('../function/classFunction');
let fileGetter = require('../fileGetter');

let router = express.Router();

//  getclass info
router.get('/id/:id', function(request, response) {

    let id = request.params.id;

    classFunction.class(id, function(result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

// get my classes
router.post('/my', function(request, response) {

    let token = request.body.token;

    classFunction.my(token, function(result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

// get all classes
router.post('/all', function(request, response) {

    let token = request.body.token;

    classFunction.all(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

// enter a class
router.post('/enter', function(request, response) {

    let token = request.body.token;
    let classs = request.body.class;

    classFunction.enter(token, classs, function(result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

// get subclass info
router.get('/sub/id/:id', function(request, response) {

    let id = request.params.id;

    classFunction.subclass(id, function(result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

// submit code
router.post('/sub/submit', function(request, response) {

    let token = request.body.token;
    let subclass = request.body.subclass;
    let code = request.body.code;

    // socket gpu-web, web-front
    classFunction.submit(token, subclass, code);

});

// submit image
router.post('/sub/image', function(request, response) {

    fileGetter(request, response, function(err) {

        // handle error
        if (err) return console.log(err);

        // image file path
        let file = request.file.filename;

        // style
        let style = request.body.style;

        classFunction.submitImage(file, style, function(result) {

            response.writeHead(200, {"Context-Type": "image/jpeg"});
            response.write(result);
            response.end();

        });

    });

});

module.exports = router;
