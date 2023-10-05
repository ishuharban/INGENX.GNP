// const express = require("express");
// const admin_route = express();
// var cons = require("consolidate");

// const session = require("express-session");
// const config = require("../config/config")
// admin_route.use(session({ secret: config.sessionSecret }));


// const bodyParser = require("body-parser");
// admin_route.use(bodyParser.json());
// admin_route.use(bodyParser.urlencoded({ extended: true }));

// admin_route.use('/static', express.static('views'));

// admin_route.engine('html', cons.swig)
// admin_route.set('view engine', 'html');
// admin_route.set('views','./views/Admin')

// const auth =require("../middlle/adminAuth")

// const adminController = require("../controllers/adminController");


// admin_route.get('/',auth.isLogout,adminController.loadLogin);


// admin_route.post('/admin',adminController.verifyLogin);

// admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

// admin_route.get('/logout',auth.isLogin,adminController.logout);

// admin_route.get('*',function(req,res){
//     res.redirect('/')
// })


// module.exports= admin_route;