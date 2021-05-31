const mongoose = require('mongoose');
 
//connection with database and creating a new db
const connect = mongoose.connect("mongodb://localhost:27017/StudentRegisteration",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Connection successfull ... 🎉");
    }) 
    .catch((err) => {
        console.log(err);
    })

 