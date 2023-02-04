const express = require("express");
const cors = require("cors");
const propertiesReader = require("properties-reader");
const bodyParser = require('body-parser');
const path = require('path');


// connecting to MongoDB with db properties
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);

let dbPprefix = properties.get("db.prefix");
// URL encoding
let dbUserName = encodeURIComponent(properties.get("db.user"));
let dbPassword = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");

/// mongoDB connection string
const dbURI = dbPprefix + dbUserName + ":" + dbPassword + dbUrl + dbParams;

/// connecting by using MongoDB Stable API
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(dbURI, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);



/// using express
let app = express();
app.set('json spaces', 3);
app.set(express.json())
app.set(express.urlencoded({ extended: true }))

/// setup cors middleware
app.use(cors());
app.use(bodyParser.json());

app.use(function (req, res, next) {
    // logger middleware outputs all incoming requests to server console
    console.log("request: " + req.url);
    next();
});


/// get route
app.get('/collections/:collectionName', function (req, res, next) {
    req.collection.find({}).toArray(function (error, results) {
        if (error) {
            return next(error);
        }
        res.send(results);
    });
});


app.get("/", function (req, res) {
    res.send("Running");
});


app.param('collectionName'
    , function (req, res, next, collectionName) {

        req.collection = db.collection(collectionName);
        return next();
    });

/// handles invalid request
app.use(function (req, res) {
    res.status(404).send("Not Found");
});

/// listening on port 4000
app.listen(4000, function () {
    console.log("port 4000");
});