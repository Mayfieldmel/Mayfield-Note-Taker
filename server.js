const { response } = require('express');
const express = require('express');
const {db} =  require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/db', (req, res) => {
    response.json(db);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})