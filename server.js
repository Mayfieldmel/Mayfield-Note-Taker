const fs = require('fs');
const path = require('path');
const express = require('express');
const db =  require('./db/db.json');

// initiate express server
const app = express();
// set up server port
const PORT = process.env.PORT || 3001;

// middleware
// informs data there might be subarray data
app.use(express.urlencoded({extended: true}));
// parses json data into req.body js object
app.use(express.json());
// retrieve css & js for routed pages
app.use(express.static('public'));

// routes
// db route (json format)
app.get('/db', (req, res) => {
    res.json(db);
});
// homepage route
app.get ('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})
// notes page route
app.get ('/notes', (req, res) => {
    let results = db;
    res.sendFile(path.join(__dirname, './public/notes.html'));
    console.log(results);
})


// set up server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})