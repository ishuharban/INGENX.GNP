const express = require("express");
const user_route = express();
var cons = require("consolidate");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const config = require("../config/config");
user_route.use(session({ secret: config.sessionSecret }));
const auth = require('../middlle/auth')

const flash = require('connect-flash');
user_route.use(session({ secret: config.sessionSecret }))
user_route.use(flash());



user_route.use('/static', express.static('views'));

user_route.engine('html', cons.swig)
user_route.set('view engine', 'html');
user_route.set('views', './views')

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));



const storage = multer.diskStorage({
  destination: './public',
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, callback) => {
    // Allow only specific file formats, e.g., JPEG and PNG
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('Invalid file format. Only JPEG and PNG files are allowed.'));
    }
  },
});

user_route.use(express.static('public'));

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController")
const validateToken = require("../middlle/validateTokenHandler");
const cookies = require("cookie-parser");

user_route.use(cookies());




// user_route.get("/register",(req,res)=>{
//   req.flash('message','Successfully Register')
//   res.redirect('/login')
// })

user_route.get("/partner", userController.loadPartner);

user_route.post(
  "/partner",
  upload.single("CancelledCheque"),
  userController.insertPartner
);

//REGISTER
user_route.get("/register", auth.isLogout, userController.registerLoad);
user_route.get("/registerID", userController.RegisterId);
user_route.post("/register", userController.insertUser);

//LOGIN 
user_route.get('/login', userController.loginLoad)
user_route.get("/", userController.loginLoad);
user_route.post("/login", userController.insertLogin);

// USER DASHBOARD
user_route.get("/dashboard", auth.isLogin, userController.loadDashboard);

//UPDATE PROFILE PHOTO
user_route.post('/upload', validateToken, upload.single('profilePhoto'), userController.UserPhoto);

//FORGOT PASSWORD
user_route.get("/forgot", userController.loadForgot);
user_route.post("/forgot", userController.forgetP);

//RESET PASSWORD
user_route.get("/forgot-password", userController.ResetPassword)
user_route.post("/forgot-password", userController.ResetP)

//Update Password route
user_route.post('/update-password', validateToken, userController.update_password)


//DEAL REGISTER
user_route.get("/dealregister", validateToken, userController.dealregister);
user_route.post("/dealregister", validateToken, userController.dealregister)

//USER VERIFY MAIL
user_route.get('/verify', userController.verifyMail)

//PROFILE VIEW
user_route.get("/profile", validateToken, userController.profileload);

//USER CHECK ALLREADY REGISTER
user_route.post("/userApproval", userController.userApproval);

//ADD NEW PARTNER ADD USER
user_route.get('/new-user', userController.newUserLoad)
user_route.post('/new-user', userController.addUsers)


//USER REGISTER DATA FETCH
user_route.get("/DealS", userController.Deals);

//SEARCH FUNCTION
user_route.get('/search', validateToken, userController.Search);

//PARTNER DEAL LIFE CYCLE
user_route.get("/DealLc", userController.loadDlc);
user_route.post("/DealLc", userController.insertDlc);

//DEAL REGISTER DATA FETCH
user_route.get("/dealsDetails", validateToken, userController.loadDealsDetails);

//PARTNER DATA FIND 
user_route.get("/partnerdetails", validateToken, userController.loadPartner);

//PARTNER DETAILS FILED
user_route.post("/partner", validateToken, userController.insertPartner)


// user_route.get('/users',userController.Vlogin)










user_route.get("/Details", validateToken, userController.loadDetails);









// user_route.get("/registerID",userController.registerid)



// user_route.get("/DealStatus",userController.Dealstatus);







user_route.delete('/deleteitem/:id', validateToken, userController.deleteitem);
user_route.get("/partner/_id", userController.getdealper)
user_route.get("/alldeals/:partnerId", userController.alldeals)



//GET DATA UNION

// user_route.get("/get-user",userController.getuser)

// user_route.post("/adduser",userController.adduser)









//................ADMIN ROUTES SET START..................//

//ADMIN ASSIGN USERS ROLES
user_route.get('/update-role', userController.UpdateRoles)
user_route.post('/update-role', userController.updateroles)
user_route.post('/delete-user', userController.deleteUser);
user_route.post('/updateUsers/:id', userController.USERUPDATED);




//ADMIN UPDATE SALES STAGE
user_route.get('/update-sales', userController.updateSales)
user_route.post('/update-stage', userController.updateStage)
user_route.post('/update-Status', userController.updateStatus)
user_route.delete('/DealDeletes/:id', userController.DealDelete)

//................ADMIN ROUTES SET END..................//


//................. ADMIN PRODUCT ADD  START......................//

//PRODUCT PAGE RENDER
user_route.get("/addProductForm", userController.ProductGET)
//PRODUCT POST
user_route.post("/addProduct", userController.ProductPost);
//PRODUCT FETCH
user_route.get("/Product", userController.ProductFetch);
// PRODUCT UPDATE
user_route.put('/updateProduct/:id', userController.ProductUpdate);
// Delete A PRODUCT
user_route.delete('/deleteProduct/:id', userController.ProductDelete);

//................. ADMIN PRODUCT ADD  END......................//



//.......ADMIN ADD OPPORTUNITY MANAGEMENT  START......//

user_route.get("/addopptypeFrom", userController.OppT);
//POST
user_route.post("/addopptype", userController.OppTy)
//Fetch
user_route.get("/OPPTYPES", userController.OPPTyp);
//UPDATED
user_route.put('/updateOpptype/:id', userController.OPPTYPE);
//DELETE
user_route.delete('/deleteOppType/:id', userController.OPPTYPEDELETE)

//.......ADMIN ADD OPPORTUNITY MANAGEMENT  END......//


//...........ADMIN CREATE A INVOICE START .........//

user_route.get('/create-invoice',userController.INVOICE);

//...........ADMIN CREATE A INVOICE END.........//





user_route.get('/getUsers', async (req, res) => {
  try {
      const users = await register.find();
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


user_route.post('/send-invoice', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(/* HTML content of the invoice */);
  await page.pdf({ path: 'invoice.pdf', format: 'A4' });
  await browser.close();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword
    }
  });

  // Email options
  const mailOptions = {
    from:config.emailUser,
    to: req.body.email, 
    subject: 'Invoice',
    text: 'Please find the attached invoice.',
    attachments: [
      {
        filename: 'invoice.pdf',
        path: 'invoice.pdf', // Path to the generated PDF
        contentType: 'application/pdf',
      },
    ],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('Error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully!');
    }
  });
});






const DealRegister = require("../model/dealRegister");

user_route.get('/grafs', async (req, res) => {
  try {
    const deals = await DealRegister.find();
    res.render("page");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});














user_route.get('*', function (req, res) {
  res.redirect('/')
})



module.exports = user_route;
