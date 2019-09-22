let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let io = require("socket.io");
let cors = require('cors');
let g_function = require('./modules/function_global');
let module_db = require('./modules/mysql_connect');
let user_router = require('./modules/router_user');
let class_router = require('./modules/router_class');

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
let sequenceNumberByClient = new Map();

console.log("socket listening........");

server.on("submit", (socket) => {

    console.log("connected!");

    sequenceNumberByClient.set(socket, 1);

    console.log(socket);

});
