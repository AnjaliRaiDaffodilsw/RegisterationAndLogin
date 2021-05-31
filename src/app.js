const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const app = express();
require("./db/conn");
const StudentRegister = require('./models/registers');

const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//for postman data
app.use(express.json());

//cookie
app.use(cookieParser());
//for form data
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));

app.set("view engine", "hbs");
app.set("views", viewsPath);

hbs.registerPartials(partialsPath);



app.get('/', (req, res) => {
    res.render("index");
});
app.get('/register', (req, res) => {
    res.render("register");
});
app.get('/login', (req, res) => {
    res.render("login");
});



app.get('/logout', auth, async (req, res) => {
    try {
        //to delete one only current user

        req.details.tokens = req.details.tokens.filter((currElem) => {
            return currElem.token !== req.token
        })



        res.clearCookie("jwt");

        await req.details.save();
        res.render("login");
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get('/logoutall', auth, async (req, res) => {
    try {

        //logout all user
        req.details.tokens = [];
        res.clearCookie("jwt");

        await req.details.save();
        res.render("login");
    } catch (err) {
        res.status(500).send(err);
    }
});

//private page creation
app.get('/secret', auth, (req, res) => {
    // console.log(`This is the cookie ${req.cookies.jwt}`);
    res.render("secret");
});
//register check
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerStudent = new StudentRegister({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword,
            })
            //password hash

            const token = await registerStudent.generateAuthToken();
            console.log(`The token is from app.js ${token}`);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            console.log(`Cookies from app.js ${cookie}`);

            const registered = await registerStudent.save();
            res.status(201).render("index");
            console.log(registered);

        } else {
            res.send("Passwords are not same sorry try again 😲");
        }

    } catch (err) {
        res.status(400).send(err);
    }
});

//login check

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userdetails = await StudentRegister.findOne({
            email: email,
        })

        const isMatch = await bcrypt.compare(password, userdetails.password);

        const token = await userdetails.generateAuthToken();
        console.log(`The token is from app.js ${token}`);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
        });

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.status(201).render("register");
        }


    } catch (err) {
        res.status(400).send(`Sorry Invalid Login details 😞 `);
    }
});
const port = 8000;



// securePassword("anjali1234");
app.listen(port, () => {
    console.log(`Server is up and running on port ${port} 🙂`);
});
