const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs')
const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true })

// creating schema
const articlesSchema = mongoose.Schema({
        title: String,
        content: String,
    })
    // creating model
const Article = mongoose.model("Article", articlesSchema)

////////////////////////////////////////////////////////////////////////Request targetting all articles///////////////////////////////////////////////////////////////////

// USING ROUTES FOR GET POST DELETE PUT 

app.route("/articles")
    .get(function(req, res) {
        Article.find({}, function(err, foundArticles) {
            if (!err) {
                ///////// Fetching each Articles content ////////
                console.log(foundArticles);
                res.send(foundArticles)

            } else {
                console.log(err);
                res.send(err);
            }
        })
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function(err) {
            if (!err) {
                res.send("successfully Added A Article");
            } else {
                res.send(err);
            }
        })
    })
    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if (!err) {
                res.send("Successfully Deleted Every Thing")
            } else {
                res.send(err);
            }
        })
    });








////////////////////////////////////////////////////////////////////////Request targetting Specific articles///////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
            if (foundArticle) {
                console.log(foundArticle);
                res.send(foundArticle)
            } else {
                console.log(err)
                res.send("NO Article found matching title");
            }
        })
    })
    .put(function(req, res) {
        Article.findOneAndUpdate({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }, function(err) {
            if (!err) {
                res.send("Successfully Updated Article")
            } else {
                console.log(err);
            }
        })
    })
    .patch((req, res) => {
        Article.findOneAndUpdate({ title: req.params.articleTitle }, { $set: req.body }, (err) => {
            if (!err) {
                res.send("Successfully Updated patch");
            } else {
                res.send(err);
                console.log(err);
            }
        })
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("successfully deleted the Article");
            } else {
                res.send(err)
            }
        })
    });
app.listen(3000, function() {
    console.log("SERVER RUNNING AT LOC : 3000 ");
})