// require('dotenv').config();
// const mongoose = require('mongoose');

// const dbState = [
//         {   value: 0, label: "disconnected" },
//         {   value: 1, label: "connected" },
//         {   value: 2,label: "connecting"},
//         {   value: 3, label: "disconnecting"}
//     ];

    
// const connection = async () => {

//     try {
//         const options = {
//             user: process.env.DB_USER,
//             pass: process.env.DB_PASSWORD,
//             dbName: process.env.DB_NAME,
    
//         }
//         await mongoose.connect(process.env.DB_HOST, options);
//         const state = Number(mongoose.connection.readyState); 
//         console.log(dbState.find(f => f.value === state).label, "to db"); //connected to db
 
//     } catch (error) {
//         console.log(">> error connection DB: ",error);
//     }
// }


// module.exports = connection;

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn =  await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;