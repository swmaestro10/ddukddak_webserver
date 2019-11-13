let http = require('http');
let https = require('https');
let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let mysqlConnector = require('./modules/mysqlConnector');
let socketServer =  require('./modules/socketServer');
let userRouter = require('./modules/route/userRouter');
let classRouter = require('./modules/route/classRouter');
let sslConfig = require('./config/ssl.json');

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

// HTTPS
let httpsServer = https.createServer({
    key: fs.readFileSync(sslConfig.privkey),
    cert: fs.readFileSync(sslConfig.fullchain)
}, app);
httpsServer.listen(443);

// HTTP
let httpServer = http.createServer(app);
httpServer.listen(80);
