let socketServer = require("socket.io");
let class_function = require('./function/classFunction');

function startServer() {

    // socket server web-front
    let server = socketServer.listen(8800);

    server.on("connection", (socket) => {

        socket.on("submit", (json) => {

            console.log(json);

            class_function.submit(json.token, json.subclass, json.code, socket);

        });

    });

}

module.exports=  {

  startServer : startServer

};
