const fs = require('fs');
const path = require('path');
const express = require('express');
const db =  require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/db', (req, res) => {
    res.json(db);
});

app.get ('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get ('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})