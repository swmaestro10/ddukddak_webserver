let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let mysqlConnector = require('./modules/mysqlConnector');
let socketServer =  require('./modules/socketServer');
let userRouter = require('./modules/route/userRouter');
let classRouter = require('./modules/route/classRouter');

mysqlConnector.startDB();
socketServer.startServer();

let app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(request, response) {

    response.send('ddukddak learning web server running');

});

app.use('/user', userRouter);
app.use('/class', classRouter);

// redirect
app.get('*', function(request, response) {

    response.redirect('/');

});

app.listen(80, () => console.log('ddukddak learning web server running'));
