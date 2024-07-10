const mongoose = require("mongoose");

const AddServiceScehma = new mongoose.Schema({
        sname: String,
        sdesc: String,
        samount: String,
    },  { collection: "AddService", } );
mongoose.model("AddService", AddServiceScehma);

//Samlpe Data 
/*
const AddService = [{
    sname : "General Service",
    sdesc : "description about your service"
    samount : "500"
}]
*/ 