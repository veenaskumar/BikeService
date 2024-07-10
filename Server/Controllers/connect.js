const mongoose = require("mongoose");
//Database Connection
module.exports.connect = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/customer', {

    })
        .then(() => {
            console.log("The database is connected")
        })
}