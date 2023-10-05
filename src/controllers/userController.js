
const register = require("../model/Registration");
const PartnerOnBoarding = require("../model/partnerOnboarding");
const Deal_lc = require("../model/dlc");
const login = require("../model/login");
const mongoose = require('mongoose');


const DealRegister = require("../model/dealRegister");
const Product = require("../model/productModel");
const Opptype = require("../model/Opptype");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const nodemailer = require("nodemailer");

const randomString = require("randomstring")
const config = require('../config/config')
const { roles } = require('../utils/constants');

//Dashboard start
const loadDashboard = async (req, res) => {
  try {
    res.render("dashboard.html");
  } catch (error) {
    console.log(error.message);
  }
};

//HashPassword

const securePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (error) {
    console.log(error)
  }
}



//REGISTER EMAIL SEND VERIFY MAIL

const sendVerifyMail = async (firstname, businessemail, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
    const mailOptions = {
      from: config.emailUser,
      to: businessemail,
      subject: "For Verification Mail",
      html: '<p>Hello ' + firstname + ' Congratulations! Your registration has been completed successfully,kindly click on the verification link within the email we sent you. This step ensures the security of your account and allows us to keep you updated with important information.After your email is successfully verified, please expect to receive your email ID and password within 48 hours. These login credentials will be sent to the email address you provided during registration.<br> <a href="http://localhost:5001/verify?id=' + user_id + '" >Verify</a> yor Mail</p> '
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email Has Been Sent:-", info.response);
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// VERIFY EMAIL 

const verifyMail = async (req, res) => {
  try {
    const updateInfo = await register.updateOne({ _id: req.query.id }, { $set: { isVerified: 1 } });

    console.log(updateInfo);
    res.render("email-verified");
  } catch (error) {
    console.log(error);
  }

}



//GET METHOD REGISTER
const registerLoad = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
}

//ID
const RegisterId = async (req, res) => {


  const data = await register.find({})
  if (data.length > 0) {
    res.json(data);

  }
  else {
    console.log("Invalid");
  }
};


//EMAIL SEND
const RegisterMail = async (firstname, businessemail,companyname, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
    const mailOptions = {
      from: config.emailUser,
      to: "admin@gmail.com",
      subject: "verify users",
      html: '<p>Hello ADMIN Please verify users ' + firstname + ' please click here to <a href="http://localhost:5001/Admin-manage-users.html?token=' + user_id + '">verify user</a> </p> <br><br> <b>Email:-</b>' + businessemail +'<br><br> <b>Company Name:-</b>' + companyname +' '
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email Has Been Sent:-", info.response);
      }
    })
  } catch (error) {
    console.log(error)
  }
}


//POST METHOD REGISTER

const insertUser = async (req, res) => {
  try {
    const newid = req.body.id;
    const status = req.body.status
    const companyname = req.body.companyname;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const address = req.body.address;
    const Gstnno = req.body.Gstnno;
    const phoneno = req.body.phoneno;
    const businessemail = req.body.businessemail;
    const website = req.body.website;

    // const password = randomString.generate(8);
    // const spassword = await securePassword(password)

    const user = register({
      newid: newid,
      status: status,
      companyname: companyname,
      firstname: firstname,
      lastname: lastname,
      address: address,
      Gstnno: Gstnno,
      phoneno: phoneno,
      businessemail: businessemail,
      website: website,
      // password:spassword,
      is_admin: 0

      //   usernametoken:crypto.randomBytes(64).toString('hex'),

    });
    const userData = await user.save();
    if (userData) {
      sendVerifyMail(req.body.firstname, req.body.businessemail, userData._id);
      RegisterMail(firstname, businessemail,companyname, userData._id),

        res.render("login", { message: "your registration has been succesfully" });
    } else {
      res.render("register", { message: "your registration has been failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


//USER LOGIN GET METHOD(1)

const loginLoad = async (req, res) => {
  try {

    res.render("login");

  } catch (error) {
    console.log(error.message);
  }
};



//USER LOGIN POST METHOD(2)
const maxLoginAttempts = 3;
const lockoutDurationMinutes = 30;

const insertLogin = async (req, res) => {
  try {


    const { businessemail, password } = req.body;

    if (!businessemail || !password) {
      res.status(400);
      throw new Error("All the fields are mandatory");
    }

    //    Compare Password with Hashed Password

    const result = await register.findOne({ businessemail });
    console.log(password);
    if (result) {
      if (result.lockedUntil && result.lockedUntil > new Date()) {
        return res.status(403).json({ message: "Account locked. Please try again later." });
      }
    }

    if (result && (await bcrypt.compare(password, result.password))) {

      const accessToken = jwt.sign(
        {

          result: {
            businessemail: result.businessemail,
            id: result.id,
            role: result.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" }
      );
      console.log(accessToken);
      res.cookie("token", accessToken);
      req.session.user_id = result._id

      const lastLogin = new Date()
      await register.updateOne(
        { _id: result.id },
        { $set: { loginAttempts: 0, lockedUntil: null } }
      );
      await register.updateOne(
        { _id: result.id },
        { $set: { lastLogin: lastLogin } }
      );
      if (result.businessemail === process.env.ADMIN_EMAIL.toLowerCase()) {
        result.role = roles.admin
        const successMessage = 'Successfully logged ADMIN!';
        res.send(`
          <script>alert("${successMessage}"); window.location.href = "home.html";</script>
         
        `)
      } else {
        const successMessage = 'Successfully logged in!';
        res.send(`
          <script>alert("${successMessage}"); window.location.href = "dashboard.html";</script>
         
        `);
      }
    } else {

      await register.updateOne(
        { _id: result.id },
        {
          $inc: { loginAttempts: 1 },
          $set: {
            lockedUntil:
              new Date() + lockoutDurationMinutes * 60 * 1000,
          },
        }
      );
      const attemptsLeft = maxLoginAttempts - (result.loginAttempts + 1);

      if (attemptsLeft <= 0) {
        const token = jwt.sign(
          { businessemail: result.businessemail },
          process.env.RESET_TOKEN_SECRET,
          { expiresIn: '1h' }
        );
        await register.updateOne(
          { _id: result.id },
          {
            $set: {
              token,
              lockedUntil: new Date() + lockoutDurationMinutes * 60 * 1000,
            },
          }
        );

        sendResetPasswordEmail(result.businessemail, token);
        return res.status(403).send(
          `<html><body><p><script>
          window.alert("Account locked. Please try again later, And Reset password link has been send your Email ");
          window.location.href = "/login";
        </script></p></body></html>`,
        );
      }

      return res.status(403).send(
        `<HTML><body>   <script>
         // JavaScript code to display an alert
         window.onload = function() {
           alert("Incorrect password. ${attemptsLeft} attempts left.");
           window.location.href = "/login";
         };
         
       </script></body></html>`,
      );
    }

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

// Function to send a password reset link to the user's email
const sendResetPasswordEmail = async (businessemail) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword
    }
  });

  const token = jwt.sign({ businessemail }, process.env.RESET_TOKEN_SECRET, {
    expiresIn: '1h',
  });



  const mailOptions = {
    from: config.emailUser,
    to: businessemail,
    subject: 'Password Reset',
    html: '<p>Hello please click here to <a href="http://localhost:5001/forgot-password?token=' + token + '">Reset</a> your Password</p> ',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

//UPDATE USER PROFILE PHOTO

const UserPhoto = async (req, res) => {
  try {
    const user_id = req.result.id;
    const newProfilePhoto = req.file.filename;
    const user = await register.findById(user_id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check the user's role
    if (user.role === roles.admin) {
      await register.findByIdAndUpdate(user_id, { profilePhoto: newProfilePhoto });
      res.render("Adminpersonaldetails");
    } else {
      // For other roles (assuming users), render the dashboard
      await register.findByIdAndUpdate(user_id, { profilePhoto: newProfilePhoto });
      res.render("personaldetails");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile photo.');
  }
};







//UPDATE PASSWORD

const update_password = async (req, res) => {
  try {
    const user_id = req.result.id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const userData = await register.findOne({ _id: user_id });

    if (userData) {
      const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);

      if (isPasswordValid) {
        const hashedNewPassword = await securePassword(newPassword);

        // Update the password
        await register.findByIdAndUpdate(
          { _id: user_id },
          {
            $set: {
              password: hashedNewPassword,
            },
          }
        );

        if (userData.role === roles.admin) {
          const successMessage = 'Successfully Password Updated';
          res.send(`
          <script>alert("${successMessage}"); window.location.href = "Adminpersonaldetails.html";</script>`)
        } else {

          const successMessage = 'Successfully Password Updated';
          res.send(`
          <script>alert("${successMessage}"); window.location.href = "personaldetails.html";</script>`)
        }
      } else {
        const errorMessage = 'Old password is incorrect!';
        res.send(`<script>alert("${errorMessage}"); window.location.href = "settings.html";</script>`);
      }
    } else {
      const errorMessage = 'User ID not found!';
      res.send(`<script>alert("${errorMessage}"); window.location.href = "settings.html";</script>`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};







//FOR FORGOT PASSWORD RESET MAIL SEND

const ResetMail = async (firstname, businessemail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
    const mailOptions = {
      from: config.emailUser,
      to: businessemail,
      subject: "For Reset Your Password",
      html: '<p>Hello ' + firstname + 'please click here to <a href="http://localhost:5001/forgot-password?token=' + token + '">Reset</a> your Password</p> '
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email Has Been Sent:-", info.response);
      }
    })
  } catch (error) {
    console.log(error)
  }
}


//GET METHOD
const loadForgot = async (req, res) => {
  try {

    res.render('forgot')
  } catch (error) {
    console.log(error.message);
  }
}

//POST METHOD PASSWORD

const forgetP = async (req, res) => {
  try {

    const businessemail = req.body.businessemail
    const userData = await register.findOne({ businessemail: businessemail });

    if (userData) {
      const randomstring = randomString.generate();
      const updateData = await register.updateOne({ businessemail: businessemail }, { $set: { token: randomstring } });
      ResetMail(userData.firstname, userData.businessemail, randomstring);
      res.render('forgot', { message: "Please check your mail to rest your password" })

    }
    else {
      res.render('forgot', { message: "User email is incorrect" })
    }

  } catch (error) {
    console.log(error.message)
  }
}

//REST PASSWORD AFTER SEND MAIL GET METHOD
const ResetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await register.findOne({ token: token });
    if (tokenData) {
      res.render('forgot-password', { user_id: tokenData._id.toString() });
    } else {
      res.render('404', { message: 'Token is invalid' });
    }
  } catch (error) {
    console.log(error.message);
  }
}

//REST PASSWORD AFTER SEND MAIL POST METHOD

const ResetP = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    console.log(user_id);

    const secure_password = await securePassword(password);
    const UpdatedData = await register.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(user_id) }, { $set: { password: secure_password, token: '' } });

    res.render('login.html');
  } catch (error) {
    console.log(error.message);
  }
}



//DealLifeCycle Start

const loadDlc = async (req, res) => {
  try {
    res.render("dlc");
  } catch (error) {
    console.log(error.message);
  }
};

const insertDlc = async (req, res) => {
  try {
    const Dealid = req.body.Dealid;
    const patnerid = req.body.patnerid;
    const dealname = req.body.dealname;
    const companyname = req.body.companyname;
    const typeofcustomer = req.body.typeofcustomer;
    const productname = req.body.productname;
    const opportunity = req.body.opportunity;
    const currenterp = req.body.currenterp;
    const numberofuser = req.body.numberofuser;

    const Data = Deal_lc({
      Dealid: Dealid,
      patnerid: patnerid,
      dealname: dealname,
      companyname: companyname,
      typeofcustomer: typeofcustomer,
      productname: productname,
      opportunity: opportunity,
      currenterp: currenterp,
      numberofuser: numberofuser,
    });
    const saveData = await Data.save();

    if (saveData) {
      res.render("dealStatus");
      // req.session.Deal_lc_id = saveData._id;
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

//show all deals 
const alldeals = async (req, res) => {
  try {
    const partnerId = req.params.partnerId
    const data = await DealRegister.find({ user_id: partnerId });

    res.status(200).json(data)
  } catch (err) {
    console.log(`Error in getting deals ${err}`);
  }
}









//Details



const loadDetails = async (req, res) => {
  if (req.session.userId) {
  } else {
    // res.redirect('details')
  }
};

// USER DEAL REGISTER
const dealregister = async (req, res) => {
  const {dealname,customername,toi,opptype,productname,nou,currenterp,estimatecost} = req.body;
  const productNamesArray = productname.split(",").map(name => name.trim());

  const data = {dealname,customername,toi,opptype,productname: productNamesArray,nou,currenterp,estimatecost,
    user_id: req.result.id,
  };

  try {
    const result = await DealRegister.create(data);
    console.log("Record inserted successfully:");
    res.render("dashboard");
  } catch (err) {
    console.error("Error inserting record:", err);
    res.status(500).json({ error: "Failed to insert record" });
  }
};








//PARTNER DETAILS FILED
const insertPartner = async (req, res) => {
  const {companylegalname,acompanyregisteredaddress,companySize,
    // companyRC: req.file.filename,
    // companyGSTC: req.file.filename,
    // companyPan: req.file.filename,
    Nameonbank, AccountNumber,bankName,IFSCcode,BranchAddress,CancelledCheque,
  } = req.body;

  const partners = {
    companylegalname,acompanyregisteredaddress,companySize,
    // companyRC: req.file.filename,
    // companyGSTC: req.file.filename,
    // companyPan: req.file.filename,
    Nameonbank,AccountNumber,bankName,IFSCcode,BranchAddress,CancelledCheque,
    user_id: req.result.id,
  };

  try {
    const result = await PartnerOnBoarding.create(partners);
    // console.log(result)
    console.log("Record inserted successfully:");
    res.render("dashboard");
  } catch (err) {
    console.error("Error inserting record:", err);
    res.status(500).json({ error: "Failed to insert record" });
  }
};


//PARTNER DATA FIND 
const loadPartner = async (req, res) => {
  const partner = await PartnerOnBoarding.find({ user_id: req.result.id });
  if (partner) {
    res.status(200).json({
      deals,
    });
  }
  res.status(404);
};




//USER CHECK ALLREADY REGISTER
const userApproval = async (req, res) => {
  const { businessemail } = req.body;
  try {
    const userAvailable = await register.findOne({ businessemail });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const user = await login.create({
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        password: randomPassword,
      });
    } else {
      res.status(400);
      throw new Error("Deals Rejected");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const loadDealsDetails = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const deals = await DealRegister.find({ user_id: req.result.id });
  const slicepage = deals.slice(startIndex, endIndex);

  console.log("Insert")
  // console.log(deals)
  if (deals) {
    res.status(200).json(
      deals
);
  }
  res.status(404);
};


// USER REGISTER DATA FETCH

const Deals = async (req, res) => {
  let search = '';
  if (req.query.search) {
    search = req.query.search;
  }

  const data = await register.find({
    $or: [
      { firstname: { $regex: '.*' + search + '.*' } },
      { lastname: { $regex: '.*' + search + '.*' } },
      { companyname: { $regex: '.*' + search + '.*' } },
    ]
  });
  // console.log(data)
  if (data.length > 0) {
    res.json(data);

  }
  else {
    console.log("Invalid");
  }
};

//GET DATA UNION

// const getData = async (req, res) => {
//   try{
//   //  var data = await register.aggregate([
//   //        {$unionWith:"login"}
//   //   ]);
//   //   console.log(data)
//   //   res.status(200).send({data:data});

//   const data = await login.findById({_id:req.params.id})
//   console.log(data)
//   res.json(data)

//   }catch(error){
//     res.status(400)
//   }
// }



//HashPassword

// const securePassword =async(password)=>{
//   try{
//       const salt =await bcrypt.genSalt(10);
//       const passwordHash =await bcrypt.hash(password,salt);
//       return passwordHash;
//   }catch (error){
//       console.log(error)
//   }
// }
// const adduser = async (req, res) => {
//   try{
//       const spassword =await securePassword(req.body.password);
//       const user =login({
//         companyname:req.body.companyname,
//         firstname:req.body.firstname,
//         lastname: req.body.lastname,
//         phoneno: req.body.phoneno,  
//         Gstnno:req.body.Gstnno,
//           email :req.body.email,
//            password  :spassword,

//   })

// const userData =await user.save()
// if(userData ){
//   res.render('home')
// }
//   }catch(error){
//       console.log(error)
//   }
// }

// get  specific user 
// const getuser = async (req,res)=>{
//   const  id =req.params._id;
//   try{
//     const data = login.findById({_id:id});
//     // console.log(data)
//     res.status(200)

//   }catch(err){
//     throw err
//   }

// }


//ADD NEW USERS

//EMAIL SEND
const addUserMail = async (firstname, email, password, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "verify your email",
      html: '<p>Hello ' + firstname + 'please click here to <a href="http://localhost:5001/verify?token=' + user_id + '">verify</a> your Password</p> <br><br> <b>Email:-</b>' + email + '<br><b>Password:-</b>' + password + ''
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email Has Been Sent:-", info.response);
      }
    })
  } catch (error) {
    console.log(error)
  }
}


//*1
const newUserLoad = async (req, res) => {
  try {
    res.render('new-user')
  } catch (error) {
    console.log(error)
  }
}

//*2
const addUsers = async (req, res) => {
  try {
    const companyname = req.body.companyname;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const Gstnno = req.body.Gstnno;
    const phoneno = req.body.phoneno;
    const email = req.body.email;
    const Department = req.body.Department
    const password = randomstring.generate(8);
    const spassword = await securePassword(password)

    const user = new login({
      companyname: companyname,
      firstname: firstname,
      lastname: lastname,
      Gstnno: Gstnno,
      phoneno: phoneno,
      email: email,
      Department: Department,
      password: spassword,
      is_admin: 0

    });
    const userData = await login.save()
    if (userData) {
      addUserMail(firstname, email, password, Department, userData._id),
        res.redirect('partnerApproval.html')

    } else {
      res.render('new-user')
    }

  } catch (error) {
    console.log(error)
  }
}

//profile load 

const profileload = async (req, res) => {
  const profile = await register.find({ _id: req.result.id });
  console.log(profile);
  if (profile) {
    res.status(200).json({
      profile
    })
  };

}

//SEARCH FUNCTION
const Search = async (req, res) => {
  const { status, productName } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (productName) {
    filter.productName = productName;
  }
  try {
    const deals = await Deal.find(filter);
    res.json(deals);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}


const deleteitem = async (req, res) => {
  try {
    const dealId = req.params.id;
    const userId = req.result.id; 
    console.log(dealId)
    const itemdelete = await DealRegister.findOneAndDelete({ _id: new ObjectId(dealId), userId });
    console.log("deleted")
  } catch (err) {
    console.log("Error in Delete");
  }
};

const getdealper = async (req, res) => {
  // try {
  //   const partnerId = await register.findById(req.params.id).exec();
  //   const deals = await DealRegister.find({ user_id: partnerId }).exec();

  //   console.log(deals)
  //   console.log(partnerId)
  //   res.render('partnerDeals', { partnerId, deals });

  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send('Internal Server Error');
  // }


  try {
    const partnerId = await register.findById(req.params.id).exec()
    const deals = await DealRegister.find({ user_id: partnerId }).exec();
    console.log(deals)
    res.status(200).json(deals, partnerId);
  } catch (error) {
    console.error('Error fetching partner deals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


//.............................ADMIN PART START...................................//

//ADMIN ASSGIN USERS ROLES

//GET METHOD
const UpdateRoles = async (req, res) => {
  try {
    const users = await register.find();
    console.log(users);
    res.status(200).json(users)

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//USERS DATA UPDATED
const transporterio = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  },
});

const USERUPDATED = async (req, res) => {
  const UserId = req.params.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const address = req.body.address;
  const phoneno = req.body.phoneno;
  const Gstnno =req.body.Gstnno;
  const website =req.body.website;
  const businessemail =req.body.businessemail;

  try {
    const updatedUser = await register.findByIdAndUpdate(
      UserId,
      { firstname, lastname, address, phoneno, Gstnno, website}, { new: true }
    );
    const mailOptions = {
      from: config.emailUser,
      to: businessemail,
      subject: 'Your User Information Updated',
      html: `<p>Hello,\n\nYour user information has been updated successfully:<br><br>First Name: ${firstname}<br><br>Last Name: ${lastname}<br><br>Address: ${address}<br><br>Phone Number: ${phoneno}<br><br>GST Number: ${Gstnno}<br><br>Website: ${website}</p>`,
    };

    transporterio.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Email sent: ' + info.response);
        res.send(
          '<script>alert("User information updated successfully and email sent!"); window.location="/Admin-manage-users.html";</script>'
        );
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}



//ADMIN ASSGIN USERS ROLES

//MAIL SEND USERS


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  },
});



//POST METHOD
const updateroles = async (req, res) => {
  const { id, role, Status } = req.body;
  const plainTextPassword = randomString.generate(8); // Generate a plain text password

  try {
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    if (!id || !role || !Status) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }
    const validstatus = ['New', 'Approved', 'Rejected', 'Pending'];

    if (!validstatus.includes(Status)) {
      req.flash('error', 'Invalid Stage');
      return res.redirect('back');
    }

    const validRoles = ['ADMIN', 'MODERATOR', 'CLIENT'];
    if (!validRoles.includes(role)) {
      req.flash('error', 'Invalid role');
      return res.redirect('back');
    }



    const user = await register.findByIdAndUpdate(id, { role, Status, password: hashedPassword }, { new: true });
    if (Status === "Rejected" || Status === "Pending") {
      const mailOptions = {
        from: config.emailUser,
        to: user.businessemail,
        subject: `Registration Status Update for ${user.companyname}`,
        html: ` <p>Your registration has been <b style = "color:green">${Status.toUpperCase()}</b>.</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });



    }
    else if (Status === 'Approved') {
      // Send an email 
      const mailOptions = {
        from: config.emailUser,
        to: user.businessemail,
        subject: `Registration Status Update for ${user.companyname}`,
        html: ` <p>Your registration has been <b style = "color:green">${Status.toUpperCase()}</b>.</p> Here are your login credentials:\n\nEmail: ${user.businessemail}\nPassword: ${plainTextPassword}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

    }

    req.flash('info', `Updated role for ${user.businessemail} to ${user.role}`);
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//USERS DELETE
const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid ID');
      return res.redirect('back');
    }

    // Delete the user from the database
    await register.findByIdAndDelete(id);

    req.flash('info', 'User deleted successfully');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//ADMIN UPDATE SALES STAGE

//GET METHOD
const updateSales = async (req, res) => {
  try {
    const users = await DealRegister.find();
    console.log(users);
    res.status(200).json(users)

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//ADMIN UPDATE SALES STAGE

//MAIL SEND USERS
const transporters = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  },
});

//POST METHOD (STATUS UPDATED)


const updateStatus = async (req, res) => {
  try {
    const { id, Status, comment } = req.body;
    console.log(req.body);

    console.log(id)
    if (!id || !Status) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
     req.flash('error', 'Invalid id');
       return res.redirect('back');
    }
     const validStatus = ['Approved', 'Rejected', 'Pending'];
       if (!validStatus.includes(Status)) {
        req.flash('error', 'Invalid Stage');
      return res.redirect('back');
    }
    const user = await DealRegister.findByIdAndUpdate(id, { Status, comment }, { new: true });
    if (Status === 'Approved' || Status === 'Rejected' || Status === 'Pending') {
      const userInfo = await register.findById(user.user_id);
      if (!userInfo) {
        console.error('User not found');
      } else {
        // Send an email
        const mailOptions = {
          from: config.emailUser,
          to: userInfo.businessemail,
          subject: `Registration Status Update for ${userInfo.companyname}`,
          text: `Your registration has been ${Status.toLowerCase()}.`,
        };
        if (Status === 'Rejected' && comment) {
          mailOptions.text += `\nReason for Rejection: ${comment}`;
        }
        transporters.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email sending error:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
        req.flash('info', `Updated Stage for ${user.dealname} to ${user.Stage}`);
         res.redirect('back');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//POST METHOD (STAGE UPDATED)
const updateStage = async (req, res) => {
 try {
    const { id, Stage } = req.body;
    console.log(req.body);
    console.log(id)
    if (!id || !Stage) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }
    const validStage = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];
    if (!validStage.includes(Stage)) {
      req.flash('error', 'Invalid Stage');
      return res.redirect('back');
    }
    const user = await DealRegister.findByIdAndUpdate(id, { Stage }, { new: true });
    if (Stage === '100%') {
      const updatedUser = await DealRegister.findByIdAndUpdate(id, { Status: 'Closed' }, { new: true });
      req.flash('info', `Updated Stage for ${updatedUser.dealname} to ${updatedUser.Stage}`);
    } else {
    req.flash('info', `Updated Stage for ${user.dealname} to ${user.Stage}`);
    }
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

//DEAL DELETE
const DealDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const deletedDeal = await DealRegister.findByIdAndRemove(id);
    if (!deletedDeal) {
      return res.status(404).json({ error: 'DealRegister not found' });
    }
    res.status(200).json({ message: 'DealRegister deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




//..............ADMIN PRODUCT ADD   START......................//

const ProductGET = ((req, res) => {
  res.render("admin_productadd")
});


//POST METHOD
const ProductPost = async (req, res) => {
  const productname = req.body.productname;
  try {
    const deal = await Product.insertMany({ productname: productname });
    console.log(deal);
    res.redirect("/addProductForm");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

//PRODUCT FETCH
const ProductFetch = async (req, res) => {
  try {
    const deal = await Product.find();
    if (!deal) {
      res.json({ "message": "No data found" })
    }
    res.json({ deal })
    console.log(deal);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

//PRODUCT UPDATED
const ProductUpdate = async (req, res) => {
  const productId = req.params.id;
  const updatedProductName = req.body.updatedProductName;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productname: updatedProductName },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//PRODUCT DELETED
const ProductDelete = async (req, res) => {
  const productId = req.params.id;

  try {
    await Product.findByIdAndRemove(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//..............ADMIN PRODUCT ADD   END......................//



//....ADMIN ADD OPPORTUNITY MANAGEMENT  START......//
const OppT = ((req, res) => {
  res.render("admin_productadd")
});

//POST METHOD
const OppTy = async (req, res) => {
  const opptype = req.body.opptype;
  try {
    const opptypes = await Opptype.insertMany({ opptype: opptype });
    console.log(opptypes);
    res.redirect("/addopptypeFrom");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

//FETCH METHOD
const OPPTyp = async (req, res) => {
  try {
    const opptypes = await Opptype.find();
    if (!opptypes.length) {
      res.json({ message: 'No data found' });
    } else {
      res.json(opptypes);
    }
    console.log(opptypes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//UPDATE METHOD
const OPPTYPE = async (req, res) => {
  const opptypeId = req.params.id;
  const updatedOpptypeData = req.body.updatedOpptype;
  try {
    const updatedOpptype = await Opptype.findByIdAndUpdate(
      opptypeId,
      { opptype: updatedOpptypeData }, { new: true });

    if (!updatedOpptype) {
      return res.status(404).send('Opportunity Type not found');
    }
    res.json(updatedOpptype);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//DELETE METHOD
const OPPTYPEDELETE = async (req, res) => {
  const productId = req.params.id;
  try {
    await Opptype.findByIdAndRemove(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//....ADMIN ADD OPPORTUNITY MANAGEMENT  END......//



//...........ADMIN CREATE A INVOICE START .........//
const INVOICE = async (req, res) => {
  try {
    const companyData = await register.find({},'companyname Gstnno businessemail');
    const dealData = await DealRegister.find({},'dealname user_id productname');
    const combinedData = {companyData,dealData};
    res.status(202).json(combinedData)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//...........ADMIN CREATE A INVOICE END .........//



module.exports = {
  //REGISTER
  registerLoad,
  RegisterId,
  insertUser,
  loadPartner,
  insertPartner,
  loginLoad,
  insertLogin,
  loadDashboard,

  loadForgot,
  forgetP,
  ResetPassword,
  ResetP,

  loadDlc,
  insertDlc,
  loadDetails,
  dealregister,
  userApproval,
  loadDealsDetails,
  Deals,
  // registerid,
  verifyMail,
  update_password,
  //   getuser,
  //  adduser,
  newUserLoad,
  addUsers,
  profileload,
  Search,
  deleteitem,
  getdealper,
  alldeals,
  //USER PROFILE PHOTO UPDATE
  UserPhoto,

  //ADMIN ROUTES//
  UpdateRoles,
  USERUPDATED,
  updateroles,
  deleteUser,
  updateSales,
  updateStage,
  updateStatus,
  DealDelete,
  // ADMIN PRODUCT ADD//
  ProductGET,
  ProductPost,
  ProductFetch,
  ProductUpdate,
  ProductDelete,
  //ADMIN OPPTYPE ADD//
  OppT,
  OppTy,
  OPPTyp,
  OPPTYPE,
  OPPTYPEDELETE,
  //ADMIN CREATE A INVOICE//
  INVOICE



};



