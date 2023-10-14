const User =require('../models/userModel');
const bcrypt = require('bcrypt');

const loadLogin = async(req,res)=>{
  try {
    res.render('login')
  }catch(error){
    console.log(error.message)
  }
}

const verifyLogin = async(req,res)=>{
  try {
    
    const email = req.body.email;
    const password = req.body.password;

     const userData = await User.findOne({email:email});
     if(userData){

      const passwordMatch= await bcrypt.compare(password,userData.password)
      
      if(passwordMatch){
         if(userData.is_Admin === 0){
          res.render("login",{message:"Email and password is incorrect"})
         }else{
          req.session.user_id = userData._id;
          res.redirect("/admin/home")
         }

      }else{
        res.render("login",{message:"Email and password is incorrect"})
      }

     }else{
      res.render("login",{message:"Email and password is incorrect"})
     }
  } catch (error) {
    console.log(error.message)
  }
}

const loadDashboard = async(req,res)=>{
  try {
    const UserData = await User.findById({_id:req.session.user_id})
    res.render("home",{admin:UserData})
    
  } catch (error) {
    console.log(error.message)
  }
}

const logout = async(req,res)=>{
  try {
    req.session.destroy();
    res.redirect("/admin")
  } catch (error) {
      console.log(error.message)
  }
}
const adminDashboard = async(req,res)=>{
  try {
    const userData = await User.find({is_Admin:0})
    res.render("dashboard",{users:userData})
  } catch (error) {
      console.log(error.message)
  }
}

const edituserLoad =async (req,res) => {
  try {
    const id = req.query.id;
    
    userData = await User.findById({_id:id})
    if(userData){
      res.render("edituser",{user:userData})
    }else{
      res.redirect("/admin/dashboard")
    }
    
  } catch (error) {
    console.log(error.message)
  }
}
const updateUsers = async (req,res) =>{
  try {
    const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,mobile:req.body.mobile,email:req.body.email}})
   
    res.redirect("/admin/dashboard")
  } catch (error) {
      console.log(error.message)
  }
}

const deleteuser = async (req,res) =>{
  try {
    const id =req.query.id;
     await User.deleteOne({_id:id});
    res.redirect("/admin/dashboard")
  } catch (error) {
      console.log(error.message)
  }
}

module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  adminDashboard,
  edituserLoad,
  updateUsers,
  deleteuser
}