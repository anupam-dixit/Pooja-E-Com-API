require('dotenv').config();
const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);
db=mongoose.connect(process.env.DB_CON_STRING)
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("🔥 Mongoose Connected 🤪")
})

module.exports = {db}