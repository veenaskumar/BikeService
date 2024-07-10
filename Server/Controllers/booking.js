

// //ADD Booking and Send Email
export const a = ()=>{
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
        const data=new CBooking({date,name,email,phone,vname,vno,vmodel,address,service,status}) 
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
                        subject: 'Booking',
                        text: `Dear ${vname},\n
                        Your service for vehicle is successfully added.\n\n
                        Please check out below the provided information are correct\n\n
                        Vehicle Number: ${vno}\nVehicle Model: ${vmodel}\nAddress: ${address}\nService: ${service}\nDate: ${date}
                        \n\nWe will intimate you about the status quickly.\n\n
                        \n\nIf any Query,be free to contact us.
                        \n\nThank You for choosing Brake Buddy!`,
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
                        console.log("Booked email sent");
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
}

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

