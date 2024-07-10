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
//Delete details
app.delete('/deletebooking/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await CBooking.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Booking deleted successfully' });
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});