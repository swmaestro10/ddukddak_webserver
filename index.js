let express = require('express');
let bodyParser = require('body-parser');
let io = require("socket.io");
let cors = require('cors');
let module_db = require('./modules/mysql_connect');
let user_router = require('./modules/router_user');
let class_router = require('./modules/router_class');
let class_function = require('./modules/function_class');

module_db.startDB();

let app = express();
app.use(bodyParser.json());
app.use(cors());

// static files
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function(request, response) {

    response.send('web server working!');

});

app.use('/user', user_router);
app.use('/class', class_router);

// redirect
app.get('*', function(request, response) {

    response.redirect('/');

});

app.listen(80, () => console.log('DDUK-DDUAK-Learning running on port 80!'));

// socket server web-front
let server = io.listen(8800);

server.on("connection", (socket) => {

    socket.on("submit", (json) => {

        console.log(json);

        class_function.submit(json.token, json.subclass, json.code, socket);

    });

});
