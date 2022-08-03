const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const catchAsync = require("./utilities/catchAsync")
const Notes = require("./models/newnote");
const path = require("path");
const date = require('date-and-time');
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/MyDiary');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

// const notes=[{title: "paris", textnote: "i love paris"}]




app.get("https://anitamatt.github.io/AniDairy/diary/home", (req, res)=>{
    res.render("home")
})

app.get("/diary/mynotes", async (req, res)=>{
    const notes = await Notes.find({});
    if (notes.length > 0) {
        res.render("mynotes", {notes})
    } 
    else {
        res.render("nonotes")
    }
    
    
})
app.get("/diary/new", (req, res)=>{
    res.render("new")
})


app.post("/diary", async (req, res)=>{
    const newNote = new Notes(req.body.Notes);
    const now = new Date();
    newNote.mytime = date.format(now, `ddd, MMM DD YYYY at hh:mm A`)
    console.log(newNote)
    await newNote.save();
    res.redirect(`/diary/${newNote._id}`);
})
app.get("/diary/:id", async (req, res) => {
    const note = await Notes.findById(req.params.id)
    res.render("show", { note })
});

app.get("/diary/:id/edit", async (req, res) => {
    const note = await Notes.findById(req.params.id)
    res.render("edit", { note})
});
app.put('/diary/:id', async (req, res) => {
    const { id } = req.params
    const newNote = req.body.Notes;
    const now = new Date();
    newNote.mytime = date.format(now, `ddd, MMM DD YYYY at hh:mm A`)
    console.log(newNote)
    const note = await Notes.findByIdAndUpdate(id, { ...newNote })
    res.redirect(`/diary/${note._id}`)
});

app.delete("/diary/:id", async (req, res) => {
    const { id } = req.params;
    const deleted = await Notes.findByIdAndDelete(id);
    console.log(deleted)
    res.redirect("/diary/mynotes");
});

app.listen(PORT, ()=>{
    console.log(`LISTENING ON PORT ${PORT}`)
})
