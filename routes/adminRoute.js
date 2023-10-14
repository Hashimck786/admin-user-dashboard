const express = require('express');
const admin_route =express();

const session = require('express-session');
const config = require("../config/config");
admin_route.use(session({
  secret:config.sessionSecret,
  resave: false,
  saveUninitialized: true
}))

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));

admin_route.set("view engine","ejs");
admin_route.set("views","./views/admin");

const adminController = require("../controllers/adminController")
const adminAuth = require("../middlewares/adminAuth")
admin_route.get('/',adminAuth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifyLogin)
admin_route.get("/home",adminAuth.isLogin,adminController.loadDashboard)
admin_route.get("/logout",adminAuth.isLogin,adminController.logout)
admin_route.get("/dashboard",adminAuth.isLogin,adminController.adminDashboard)
admin_route.get("/edit-user",adminAuth.isLogin,adminController.edituserLoad)
admin_route.post("/edit-user",adminController.updateUsers)
admin_route.get("/delete-user",adminAuth.isLogin,adminController.deleteuser)
admin_route.get('*',adminAuth.isLogout,function(req,res){
  res.redirect("/admin");

})

module.exports = admin_route;