var express = require("express");

var router = express.Router();

router.post(
  "/signin",
  express.urlencoded({ extended: true }),
  function (req, res) {
    let username = req.body.username;
    let pw = req.body.password;
    let db = req.db;
    let col = db.get("userList");

    col
      .find({ name: username })
      .then((docs) => {
        if (docs.length != 0 && docs[0]["password"] == pw) {
          let name = docs[0]["name"];
          let icon = docs[0]["icon"];
          req.session.userId = docs[0]["_id"];
          let jsonStr = `{"username": "${name}", "icon": "${icon}"}`;
          let obj = JSON.parse(jsonStr);

          let noteList = db.get("noteList");

          noteList
            .find({ userId: req.session.userId.toString() })
            .then((docs) => {
              let notes = [];
              for (doc of docs) {
                notes.push({
                  _id: doc._id,
                  lastsavedtime: doc.lastsavedtime,
                  title: doc.title,
                });
              }
              obj["notes"] = notes;
              res.send(JSON.stringify(obj));
            })
            .catch((err) => {
              res.send(err);
            });
        } else {
          res.send("Login failure");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

router.get("/logout", function (req, res) {
  req.session.userId = null;
  res.send("");
});

router.get("/getnote", function (req, res) {
  let id = req.query.noteid;
  let db = req.db;
  let col = db.get("noteList");

  col
    .find({ _id: id })
    .then((docs) => {
      res.send(JSON.stringify(docs[0]));
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put(
  "/savenote/:noteid",
  express.urlencoded({ extended: true }),
  function (req, res) {
    let noteId = req.params.noteid;
    let title = req.body.title;
    let content = req.body.content;
    let db = req.db;
    let noteList = db.get("noteList");
    let datetime = new Date();
    let dateStr =
      datetime.toTimeString().split(" ")[0] + " " + datetime.toDateString();

    noteList
      .update(
        { _id: noteId },
        { $set: { title: title, content, content, lastsavedtime: dateStr } }
      )
      .catch((err) => {
        res.send(err);
      });

    res.send(dateStr);
  }
);

router.post(
  "/addnote",
  express.urlencoded({ extended: true }),
  function (req, res) {
    let title = req.body.title;
    let content = req.body.content;
    let db = req.db;
    let noteList = db.get("noteList");
    let datetime = new Date();
    let dateStr =
      datetime.toTimeString().split(" ")[0] + " " + datetime.toDateString();

    noteList
      .insert(
        {
          userId: req.session.userId.toString(),
          lastsavedtime: dateStr,
          title: title,
          content: content,
        },
        function (err, doc) {
          res.send(
            `{"_id": "${doc._id}", "lastsavedtime": "${doc.lastsavedtime}"}`
          );
        }
      )
      .catch((err) => {
        res.send(err);
      });
  }
);

router.get("/searchnotes", function (req, res) {
  let db = req.db;
  let noteList = db.get("noteList");
  let searchStr = req.query.searchstr;
  console.log(req.session.userId.toString());
  noteList
    .find({
      $and: [
        { userId: req.session.userId.toString() },
        {
          $or: [
            { content: { $regex: searchStr } },
            { title: { $regex: searchStr } },
          ],
        },
      ],
    })
    .then((docs) => {
      let notes = [];
      for (note of docs) {
        notes.push({
          _id: note._id,
          lastsavedtime: note.lastsavedtime,
          title: note.title,
        });
      }
      res.send(notes);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.delete("/deletenote/:noteid", function (req, res) {
  let db = req.db;
  let noteList = db.get("noteList");
  let noteId = req.params.noteid;

  noteList
    .remove({ _id: noteId })
    .then((docs) => {
      res.send("");
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
