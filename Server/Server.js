const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
app.use(cors());

SECRECT_KEY = 'supersecrect';

const User = require("./Model/Customer.js")

const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'brakebuddy8@gmail.com',
        pass: 'hnnr zczr gddl dqja'
    }
});



//Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/customer',{

})
.then(()=>{
    console.log("The database is connected")
})

app.listen(5000, () => console.log('Server Started'));

// Importing Modules
require("./Model/Customer.js");
require("./Model/Admin.js");
const Admin = mongoose.model("AdminInfo");
require("./Model/Addservice.js");
const AService = mongoose.model("AddService");
require("./Model/AddBooking.js");
const CBooking = mongoose.model("AddBooking");

// Admin
// Add Service
app.post("/addservices", async (req, res) => {
    const { sname, sdesc, samount } = req.body;
    try {
        const check = await AService.findOne({ sname });
        if (check === null) {
            await AService.create({ sname, sdesc, samount, });
            res.send({ status: "ok" });
        } else {
            res.send({ status: "error1" });
        }
    } catch (error) {
        res.send({ send: "catch error" });
    }
});

//All Service
app.post("/service", async (req, res) => {
    try {
        const data = await AService.find();
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});

//Fetch A Service
app.post("/fetchservice", async (req, res) => {
    const { _id } = req.body;
    try {
        const data = await AService.findOne({ _id: _id });
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});

//Update A Service
app.post("/updateservice", async (req, res) => {
    var { data } = req.body;
    try {
        data = await AService.updateOne({ _id: data._id }, { $set: { sname: data.sname, sdesc: data.sdesc, samount: data.samount } });
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});

//Delete A Service
app.post("/deleteservice", async (req, res) => {
    const { _id } = req.body;
    try {
        const data = await AService.deleteOne({ _id: _id });
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});


// delete bboking


//View All Booking
app.post("/custbooking", async (req, res) => {
    const { status } = req.body;
    try {
        if (status == null) {
            const data = await CBooking.find();
            res.send({ status: "OK", data: data });
        } else {
            const data = await CBooking.find({ status });
            res.send({ status: "OK", data: data });
        }

    } catch (error) {
        console.log(error);
    }
});


//delete booking
app.delete('/custdeletebooking/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await CBooking.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ status: 'OK', message: 'Booking deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', error: 'Booking not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});
//Admin delete
app.delete('/addeletebooking/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await CBooking.findByIdAndDelete(id);
        if (booking) {
            res.json({ status: 'OK', message: 'Booking deleted successfully' });
        } else {
            res.json({ status: 'error', message: 'Booking not found' });
        }
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

//Update Service
app.post("/updatebooking", async (req, res) => {
    const { _id, status,email } = req.body;
    console.log(req.body);
    try {
        console.log(_id);
        var data = await CBooking.updateOne({ _id: _id }, { $set: { status: status } });
        console.log(status);
        data = await CBooking.findOne({ _id: _id });

        if (status === "Ready") {
            let mailOptionsu = {
                from: 'brakebuddy8@gmail.com',
                to: email,
                subject: 'Booking',
                text: 'Service for your Vehicle is Completed and Pick your Vehicle\nHappy and safe Ride!',
            };
        transporter.sendMail(mailOptionsu, (error, info) => {
            if (error) {
                return console.log(`Error in if : ${error}`);
            }
            console.log('Message sent: %s', info.messageId);
        });
        
        }
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.log(error);
    }
});



//User Login
app.post("/login", async (req, res) => {
    const { uname, password } = req.body;
    try {
        let user;

        if (uname === "venaskumar812@gmail.com") {
            user = await Admin.findOne({ uname: uname });
        } else {
            user = await User.findOne({ email: uname });
        }

        // Check if user exists
        if (!user) {
            return res.json({ status: "error", error: "User Not Found" });
        }

        // Validate password
        if (password !== user.pass) {
            return res.json({ status: "error", error: "Invalid Password" });
        }

        // Successful login
        const token = jwt.sign({email:user.email,id:user._id},SECRECT_KEY);
        return res.json({ status: "ok", data: user , token:token, role:user.role});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: "error", error: "Server Error" });
    }
});


// //User Register
app.post("/signup", async (req, res) => {
    var { email, phone, pass } = req.body;
    // pass = await bcrypt.hash(pass, 13);
    const role = "user";
    try {
        const check = await User.findOne(({ $or: [{ email }, { phone }] }));
        if (check === null) {
            await User.create({
                email,
                phone,
                pass,
                role,
            });
            res.send({ status: "ok" });
        } 
        else {
            res.send({ status: "error" });
        }
    } catch (error) {
        res.send({ send: `catch error ${error}` });
    }
});

// //ADD Booking and Send Email
app.post("/addbooking", async (req, res) => {
    const { date, name, email, phone, vname, vno, vmodel, address, service } = req.body;
    const vehicle_data = req.body
    console.log(vehicle_data);
    console.log(date,name);
    var status = "Pending";
    try {
        const check = await CBooking.findOne({ date: date, vno: vno })
        console.log(check);
        const check2 = await CBooking.findOne({ vno: vno, status: { $in: ["Pending", "Ready"] } })
        // var count1 = await Admin.find({}, { noofbook: 70 })
        // console.log(count1);
        // const count = await CBooking.find({ date: date }).count()
        // count1 = count1[0].noofbook
        const data=new CBooking({date,name,email,phone,vname,vno,vmodel,address,service,status}) 
        // await data.save();
        // res.send({ status: "ok" });
        if (check === null) {
            if (check2 === null) {
                // console.log("Hello");
                    // console.log("Hello");
                    await CBooking.create({ date, name, email, phone, vname, vno, vmodel, address, status, service });
                    let mailOptions = {
                        from: 'brakebuddy8@gmail.com',
                        to: 'vibeeshnataraj1@gmail.com',
                        subject: 'Booking',
                        text: `New Customer Booking Details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nVehicle Name: ${vname}\nVehicle Number: ${vno}\nVehicle Model: ${vmodel}\nAddress: ${address}\nService: ${service}\nDate: ${date}`,
                    };
                    let mailOptionsForCust = {
                        from: 'brakebuddy8@gmail.com',
                        to: email,
                        subject: 'Booking Confirmation',
                        html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h2 style="color: #2c3e50;">Dear ${name},</h2>
                            <p>Your service for your vehicle has been successfully added. Please review the information provided below:</p>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                <tr>
                                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Vehicle Number:</th>
                                    <td style="padding: 8px;">${vno}</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Vehicle Model:</th>
                                    <td style="padding: 8px;">${vmodel}</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Address:</th>
                                    <td style="padding: 8px;">${address}</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Service:</th>
                                    <td style="padding: 8px;">${service}</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Date:</th>
                                    <td style="padding: 8px;">${date}</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">We will update you on the status shortly.</p>
                            <p>If you have any questions, feel free to contact us.</p>
                            <p style="margin-top: 20px;">Thank you for choosing Brake Buddy!</p>
                            <p style="color: #95a5a6;">Best regards,<br>Brake Buddy Team</p>
                        </div>
                        `
                    };
                    
                    transporter.sendMail(mailOptionsForCust, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                    });
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                    });
                    
                    // .then(() => {
                        console.log("Booked email sent");
                    // }).catch((err) => {
                        // console.log(err);
                    // });
                    res.send({ status: "ok" });
            } else {
                res.send({ status: "NotCompleted" })
            }
        }
         else {
            res.send({ status: "exist" });
        }
    } catch (error) {
        // console.log("Error")
        res.send({ send:`${error}`  });
        console.log(`${error}`);
    }
});

//Fetch All Completed Booking
app.post("/history", async (req, res) => {
    const { email } = req.body;
    try {
        const data = await CBooking.find({ email: email, status: "Completed" });
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});

//Fetch All Booking without Status Completed
app.post("/fetchbook", async (req, res) => {
    const { email } = req.body;
    try {
        const data = await CBooking.find({ email: email, status: { $nin: ["Completed"] } });
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});

//Details of  Booking
app.post("/viewbooking", async (req, res) => {
    const { _id } = req.body;
    try {
        const data = await CBooking.findOne({ _id });
        res.send({ status: "OK", data: data });
    } catch (error) {
        console.log(error);
    }
});

// //Admin and User Forgot Password
app.post("/forgotpasswordotp", async (req, res) => {
    var { email, otp } = req.body;
    try {
        let mailOptionsu = {
            from: 'brakebuddy8@gmail.com',
            to: email,
            subject: 'Reset passeord',
            text: `Yout OTP : ${otp}`,
        };
    transporter.sendMail(mailOptionsu, (error, info) => {
        if (error) {
            return console.log(`Error in if : ${error}`);
        }
        console.log('Reset Password Message sent: %s', info.messageId);
    });
        res.send({ status: "ok" });
    } catch (error) {
        console.log(error);
    }
});

// //Update Password
app.post("/forgotpasswordupdate", async (req, res) => {
    var { email, pass } = req.body;
    // pass = await bcrypt.hash(pass, 13);
    try {
        if (email === "vibeeshnataraj1@gmail.com" || email === "9344136348") {
            data = await Admin.updateOne({ email: email }, { $set: { pass: pass } });
        } else {
            data = await User.updateOne({ email: email }, { $set: { pass: pass } });
        }
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.log(error);
    }
});

app.post("/authcheck", async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // console.log('Authorization Header:', authHeader); // Log the Authorization header
    // console.log('Extracted Token:', token); // Log the token

    if (!token) {
        return res.status(401).send({ status: 'error', message: 'Token required' });
    }

    try {
        const verify = jwt.verify(token, SECRECT_KEY);
        res.status(200).send({ status: 'success', message: 'Token is valid' });
        next();
    } catch (error) {
        console.error('Token verification error:', error); 
        res.status(401).send({ status: 'error', message: 'Invalid token' });
    }
});


