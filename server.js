// dependencies
const fs = require("fs");
const path = require("path");
const express = require("express");
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');
const uuid = require("./helpers/uuid");

// initiate express server
const app = express();
// set up server port
const PORT = process.env.PORT || 3001;

// middleware
// informs data there might be subarray data
app.use(express.urlencoded({ extended: true }));
// parses json data into req.body js object
app.use(express.json());
// retrieve css & js for routed pages
app.use(express.static("public"));

// routes
// homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// notes page route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// handle requests on the back-end
//  get notes request
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    const notesArr = JSON.parse(data);
    res.json(notesArr);
  })
});

// create new note array & push new note to it
function createNewNote(body, notesArr) {
  const note = body;
  notesArr.push(note);
  return writeArray(notesArr);
}
// Validate new note
function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}
// post note request
app.post("/api/notes", (req, res) => {
  req.body.id = uuid();
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted");
  } else {
    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err; 
      const notesArr = JSON.parse(data);
      const notes = createNewNote(req.body, notesArr);
      res.json(notes);
    })
  }
});

// find deleted item and remove it from db
function deleteById(id) {
  return fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    const notesArr = JSON.parse(data);
     // filter db by id
  const result = notesArr.filter((note) => note.id !== id);
  writeArray(result)
  return result;
  })
}
// write new file w/ updated array to replace db
function writeArray(newNotesArr) {
fs.writeFile("./db/db.json", JSON.stringify(newNotesArr, null, "\t"), "utf8", (err) => {
    if (err) throw err;
    console.log("The file has been updated!");
  });
}
// delete note request
app.delete("/api/notes/:id", (req, res) => {
  const result = deleteById(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

// wildcard route back to homepage
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


// set up server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
