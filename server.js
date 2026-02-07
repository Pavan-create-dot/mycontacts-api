const express=require("express");
const errorHandler=require("./middleware/errorHandler")
const connectDb=require("./config/dbConnection");
const dotenv=require("dotenv").config();
const path=require("path");

connectDb();

const app=express();

const port=process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/contacts',require("./routes/contactRoutes"));
app.use('/api/user',require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Server running on port ${port} `);
});