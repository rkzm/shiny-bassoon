var express, bookrouter, routes, bookcontroller;

express = require('express');
bookrouter = express.Router();

routes = function (Book) {
    bookcontroller = require('../controllers/bookcontroller')(Book);
    bookrouter.route('/')
        .post(bookcontroller.post)
        .get(bookcontroller.get);
    bookrouter.use('/:bookid', function (req, res, next) {
        Book.findById(req.params.bookid, function (err, book) {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send("no book found");
            }
        });
    });
    bookrouter.route('/:bookid')
        .get(function (req, res) {
            var returnBook = req.book.toJSON();
            returnBook.links = {};
            returnBook.links.FilterByGenre = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
            res.json(returnBook);
        })
        .put(function (req, res) {
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.book);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                req.book[p] = req.body[p];
            }
            req.book.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.book);
                }
            });
        })
        .delete(function (req, res) {
            req.book.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send("removed");
                }
            });
        });
    return bookrouter;
};

module.exports = routes;