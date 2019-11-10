let multer = require('multer');
let moment = require('moment');

let storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, './uploads');

    },
    filename: function(req, file, cb) {

        cb(null, moment().format('YYYYMMDDHHmmss') + "_" + file.originalname);

    }

});

let upload = multer({ storage: storage }).single("file");

module.exports = upload;
