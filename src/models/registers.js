const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//generating tokens 
studentSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({
            _id: this._id.toString()
        },
            "HeyGuysMyNameIsAnjaliRaiHowAreYou"
        );
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        console.log(`The token is from registers.js -> ${token}`);
        return token
    } catch (error) {
        res.send(`The error part ${error}`);
    }
}
//converting password into hash
studentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10);

        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    }
    next();
})
const StudentRegister = new mongoose.model("StudentRegister", studentSchema);


module.exports = StudentRegister;