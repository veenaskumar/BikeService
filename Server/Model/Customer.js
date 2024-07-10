const mongoose = require("mongoose");

const CustDetailsSchema = new mongoose.Schema({
    email: String,
    phone: String,
    pass: String,
    role: String,
});

const User = mongoose.model("user", CustDetailsSchema);
module.exports = User;

//Samlpe Data
/*
const CustInfo = [{
    email : "vibeeshn.21aid@kongu.edu",
    phone : "9344136348"
    pass : "Vibeesh.001"
    role : "User"
}]
*/ 