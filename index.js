const express = require("express");

const exphbs  = require('express-handlebars');

const bodyParser = require('body-parser');

const categoriesModel = require("./models/categories");

const productModel = require("./models/product");

const sellersModel = require("./models/sellers");

const usersModel = require("./models/users");

//loads the environment variable file
require('dotenv').config({path: "./config/keys.env"});


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
    console.log(process.env.SEND_GRID_API_KEY);
   
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


//DASHBOARD route
app.get("/dashboard", (req,res)=>{
    res.render("general/dashboard",{
        title: "Dashboard"
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


   const fnError=[];
   const lnError=[];
   const emError=[];
   const pwError1=[];
   const pwError2=[];



    if(req.body.firstName == "")
    {
        fnError.push("Enter your First Name");
    }

    if(req.body.lastName == "")
    {
        lnError.push("Enter your last name");
    }

    if(req.body.username == "")
    {
        emError.push("Enter your email");
    }
   


    const pwLength = req.body.password.length;
    console.log(pwLength); 

    if( req.body.password == "")
    {
        pwError1.push("Enter your password");
    }
    else if(pwLength> 0 && (pwLength < 6 || pwLength > 12))
     {
         console.log(`inside`);
         pwError2.push("Password must have at least 6 characters but no more than 12");
         console.log(pwError2);
     }
    

    if(fnError.length > 0 || lnError.length > 0 || emError.length > 0 || pwError1.length > 0 || pwError2.length > 0)

    {
        console.log(`inside 2`);
        console.log(fnError);
        console.log(lnError);
        console.log(emError);
        console.log(pwError1);
        console.log(pwError2);

        res.render("registration/registration",{
            //errors: errMsg
            errorFN: fnError,
            errorLN: lnError,
            errorEM: emError,
            errorPW1: pwError1,
            errorPW2: pwError2
        })
    
    }
    else
    {
        //destructuring
        const {firstName,lastName,username, password} =req.body;
    

        usersModel.pushUser({firstName,lastName,username, password});
        
        
        // res.render("registration/registration",{
        //         title : "Registration Page",
        //         successMessage :`Thank you ${firstName} ${lastName}
        //         your account is registered! Go to login page.`,
                
        // });

       
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
        to: `${username}`,
        from: 'support@shopWell.ca',
        subject: `${firstName} Welcome to shopWell!`,
        text: `You're there! Please confirm your email address. By clicking on the following link, you are confirming your email address.`,
        html: `You're there! <br>Please confirm your email address. <br> <br> By clicking on the following link, you are confirming your email address.`,
        };
        sgMail.send(msg)
        .then(()=>{
            res.redirect("/dashboard");
        })
        .catch(err=>{
            console.log(`Error ${err}`);
        })
    }
            

    

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

   const usrError=[];
   const pwError=[];
   //const {username,password} = req.body;
   const {firstName,lastName,username, password} =req.body;
   let users = usersModel.findUser(username, password, firstName);

   if(username == "")
   {
       usrError.push("Enter your username");
   }

   if(password == "")
   {
       pwError.push("Enter your password");
   }

   if(usrError.length > 0 || pwError.length > 0)
    {
        
        console.log(usrError);
        console.log(pwError);
        res.render("registration/login",{
            errorUSR: usrError,
            errorPW: pwError
        })
    }
   else
   {
    res.render("registration/login",{
        title : "Login Page",
        successMessage :`Welcome ${users[0].firstName}!`
        
    });
   }


   

});
//ROUTES


//server setup by calling listen function on the app object
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Web Server is up and running`);
});
