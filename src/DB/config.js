const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://IGPN:1234IGPN@cluster0.afq6obb.mongodb.net/company_user', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;



db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))

module.exports = db;


//mongodb+srv://IGPN:1234IGPN@cluster0.afq6obb.mongodb.net/company_user?retryWrites=true&w=majority