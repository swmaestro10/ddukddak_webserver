let socketServer = require("socket.io");
let classFunction = require('./function/classFunction');

function startServer() {

    // socket server web-front
    let server = socketServer.listen(8800);

    server.on("connection", (socket) => {

        socket.on("submit", (json) => {

            console.log(json);

            classFunction.submit(json.token, json.subclass, json.code, socket);

        });

    });

}

module.exports=  {

  startServer : startServer

};
