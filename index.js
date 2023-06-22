const express = require("express");
const cors = require("cors");

const app = express();
const authRoute = require("./app/routes/auth.routes");
const portfolioRoute = require("./app/routes/portfolio.routes");
const projectRoute = require("./app/routes/project.routes");
const taskRoute = require("./app/routes/task.routes");
const peopleRoute = require("./app/routes/people.routes");
app.set('view engine', 'ejs');

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const db = require("./app/models");

// routes
// app.get("/", (req, res) => {
//     res.send('Welcome to workluge.....\n     note: while accessing restricted apis(for manager only) use header "Authorization: Bearer /your-jwt-token/"');
// });
app.get("/", (req, res) => {
    res.render("home");
});

app.use('/api/auth', authRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/project', projectRoute);
app.use('/api/task', taskRoute);
app.use('/api/people', peopleRoute);


// Set up the MongoDB connection
db.mongoose
    .connect(`mongodb://0.0.0.0:27017/Workluge`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// Set the port and start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
