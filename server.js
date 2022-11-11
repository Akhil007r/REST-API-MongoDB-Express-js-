const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema)




// DOING OPERATION WITH OUT ROUTE USING NORMAL WAY

app.get("/articles", function(req, res) {
    Article.find({}, function(err, foundArticles) {
        if (!err) {
            // for fetching each articles title
            foundArticles.forEach(foundArticles => {
                console.log(foundArticles.title, foundArticles.content)
            });
            res.send(foundArticles)

        } else {
            console.log(err);
            res.send(err)
        }
    })
})

// Post Request

app.post("/articles", function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err) {
        if (!err) {
            res.send("successfully Added A Article");
        } else {
            res.send(err)
        }
    })
})

// Delete Request 

app.delete("/articles", function(req, res) {
    Article.deleteMany({}, function(err) {
        if (!err) {
            res.send("Successfully Deleted Every Thing")
        } else {
            res.send(err)
        }
    })
})


app.listen(3000), () => {
    console.log("Server Strated at loc 3000")
}