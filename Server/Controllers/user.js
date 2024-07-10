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
module.exports=app.post("/forgotpasswordupdate", async (req, res) => {
    var { email, pass } = req.body;
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
