const express = require("express");

const exphbs  = require('express-handlebars');

const bodyParser = require('body-parser');

const categoriesModel = require("./models/categories");

const productModel = require("./models/product");

const sellersModel = require("./models/sellers");

const usersModel = require("./models/users");


//creates the app object
const app=express();

//MIDDLEWARE
//handlebars middleware
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs());

//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//express middleware
app.use(express.static('public'));
//MIDDLEWARE


//ROUTES
//HOME route
app.get("/",(req,res)=>{

   
    res.render("general/home",{
        title:"Home",
        headingInfo: "Home Page",
        categories :categoriesModel.getAllProducts(),
        sellers :sellersModel.getAllProducts()
    });

});

//PRODUCTS route
app.get("/products",(req,res)=>{

    res.render("general/products",{
        title:"Products",
        headingInfo: "Products",
        products :productModel.getAllProducts()
        
    });
   
});


//REGISTRATION route
app.get("/registration",(req,res)=>{

    res.render("registration/registration",{
        title:"Registration",
        headingInfo: "Regstration"

    });

});


//Handle when a user submits registration form
app.post("/registration",(req,res)=>{

            //destructuring
            const {firstName,lastName,username, password} =req.body;

            usersModel.pushUser({firstName,lastName,username, password});
            
            res.render("registration/registration",{
                    title : "Registration Page",
                    successMessage :`Thank you ${firstName} ${lastName}
                    your account is registered! Go to login page.`,
                    
            });

    

});



//LOGIN route
app.get("/login",(req,res)=>{

   
    res.render("registration/login",{
        title:"Login",
        headingInfo: "Login"

    });

});

//Handle when a user submits login info
app.post("/login",(req,res)=>{

   const {username,password} = req.body;
   let users = usersModel.findUser(username, password);

   res.render("registration/login",{
    title : "Login Page",
    successMessage :`Welcome ${users[0].firstName}!`
    
});
   

});
//ROUTES


//server setup by calling listen function on the app object
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Web Server is up and running`);
});