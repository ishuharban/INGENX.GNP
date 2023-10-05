// const login = require("../model/login");
// const bcrypt = require('bcrypt');


// //GET METHOD ADMIN LOGIN
// const loadLogin = async (req, res) => {
//     try {
//       res.render("login");
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

// //POST METHOD ADMIN LOGIN

// const verifyLogin = async (req, res) => {
//   try {

//      const email = req.body.email;
//      const password = req.body.password;

//      const userData = await login.findOne({email:email})

//      if(userData){

// const passwordMatch = await bcrypt.compare(password,userData.password);

// if(passwordMatch){

//   if(userData){
//     res.render("login",{message:"Email and Password incorrect"});
//   }
//   else{
//     req.session.user_id = userData._id;
//     res.redirect("/home")
//   }

// }
// else{
//   res.render("login",{message:"Email and Password incorrect"});
// }

//      }
//      else{
//       res.render("login",{message:"Email and Password incorrect"});
//      }


//   } catch (error) {
//     console.log(error.message);
//   }
// };

// const loadDashboard = async (req, res) => {
//   try {
//     res.render("home");
//   } catch (error) {
//     console.log(error.message);
//   }
// };


// const logout = async (req, res) => {
//   try {
//     req.session.destroy();
//     res.redirect('/')
//   } catch (error) {
//     console.log(error.message);
//   }
// };











//   module.exports={
//     loadLogin,
//     verifyLogin,
//     loadDashboard,
//     logout
//   }