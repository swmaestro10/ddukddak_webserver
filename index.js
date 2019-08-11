let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let g_function = require('./modules/function_global');
let module_db = require('./modules/mysql_connect');
let user_route = require('./modules/route_user');

let main_template = "`" + fs.readFileSync('./html/main.html') + "`";
let main_card_lecture_template = "`" + fs.readFileSync('./html/main_card_lecture.html') + "`";

let length = 13;
let title = ['Basic', 'Machine Learning', 'Preprocessing', 'Language', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
let text = ['hello', 'this is', 'asdfgh', 'texttext', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

let column = 3;

module_db.startDB();

let app = express();
app.use(bodyParser.json());

// static files
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function(request, response) {

    let cards = ``;

    for(let i = 1; i <= length; i++) {

        if(i % column === 1) cards += `<div class="row" style="margin: 30px">`;

        let main_card_lecture_params = {title: title[i-1], text: text[i-1]};
        cards += g_function.eval_template(main_card_lecture_template, main_card_lecture_params);

        if(i === length && i % column !== 0) for(let j = 0; j < column - (length % column); j++) cards += `<div class="col"></div>`;

        if(i % column === 0 || i === length) cards += `</div>`;

    }

    let main_params = {name: 'USER', id: 1, lecture: cards};
    let main_result = g_function.eval_template(main_template, main_params);

    response.send(main_result);

});

app.get('/user/login', function(request, response) {

    user_route.login(request, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

app.get('/user/data', function (request, response) {

    let token = request.body.token;

    user_route.data(token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    })

});

app.get('/test/token', function(request, response) {

    user_route.tokenCheck(request.body.token, function (result) {

        response.writeHead(200);
        response.end(JSON.stringify(result));

    });

});

// redirect
app.get('*', function(request, response) {

    response.redirect('/');

});

app.listen(80, () => console.log('Started web on port 80!'));
