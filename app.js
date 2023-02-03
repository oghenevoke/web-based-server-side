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