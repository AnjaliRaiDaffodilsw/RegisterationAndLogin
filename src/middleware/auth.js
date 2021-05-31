const jwt = require('jsonwebtoken');

const StudentRegister = require('../models/registers');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        const verifyUser = jwt.verify(token, "HeyGuysMyNameIsAnjaliRaiHowAreYou");
        const details = await StudentRegister.findOne({ _id: verifyUser._id });
        console.log(details.firstname);

        req.token = token;
        req.details = details;
        
        next();
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = auth;