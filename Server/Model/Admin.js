const mongoose = require("mongoose");

const AdminDetailsScehma = new mongoose.Schema({
        email: String,
        phone: Number,
        noofbook:Number,
        pass: String,
        role: String,
    },
    { collection: "AdminInfo", } );
mongoose.model("AdminInfo", AdminDetailsScehma);

//Samlpe Data 
/*
const AdminInfo = [{
    email : "vibeeshnataraj1@gmail.com",
    phone : "9344136348"
    pass : "Vibeesh.001"
    role : "Admin"
}]
*/ 