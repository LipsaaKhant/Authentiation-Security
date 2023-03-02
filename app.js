//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { stringify } = require("querystring");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.set('strictQuery', false);

const app = express();

const port = process.env.PORT || 3000;


mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true })
.then(res => console.log('Connected to db'));

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

//Adding secret
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});



const User = new mongoose.model("User", userSchema);

app.use(express.static("public", { index: 'default.htm' }));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));




app.get('/', (req, res) => {
    res.render('home');
  });
   
app.get('/login', (req, res) => {
    res.render('login');
});
   
app.get('/register', (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/login", function(req,res){
    const username = req.body.userName;
    const password = req.body.password;

    User.findOne({email: username})
    .then((foundUser) => {
        if(foundUser){
            console.log(foundUser);
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
   })
   .catch((error) => {
       //When there are errors We handle them here
        console.log(err);
        res.send(400, "Bad Request");
   });
      
});



app.listen(port, () => console.log(`Server started at port: ${port}`));