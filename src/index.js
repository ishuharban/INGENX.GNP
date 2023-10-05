
const express = require("express")
const mongoose = require("mongoose");
const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute")
const bodyParser = require("body-parser");


const port = process.env.PORT || 4000;


require("./DB/config")

const db = mongoose.connection;

const app = express()

app.use(express.static('views'))

//for user routes
require('./routes/userRoute')
app.use('/', user_route)
app.use(bodyParser.urlencoded({
    extended: true,
}))

//Admin Route
// require('./routes/adminRoute')
// app.use('/admin',admin_route)


app.listen(port, () => {
    console.log(`listing to the port at ${port}`);
})
