const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to mongodb ✅")
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

module.exports = connectToDb;