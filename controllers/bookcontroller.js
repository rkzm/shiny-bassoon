var bookcontroller = function (Book) {
    var post = function (req, res) {
        book = new Book(req.body);
        if (!req.body.title) {
            res.status(400);
            res.send('Title is required');
            return;
        }
        if (!req.body.author) {
            res.status(400);
            res.send('Author is required');
            return;
        }
        book.save();
        res.status(201);
        res.send(book);
    };

    var get = function (req, res) {
        query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Book.find(query, function (err, books) {
            if (err) {
                res.status(500).send(err);
            } else {
                var returnBooks = [];
                books.forEach(function (element, index, array) {
                    var newBook = element.toJSON();
                    newBook.links = {};
                    newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                    returnBooks.push(newBook);
                });
                res.json(returnBooks);
            }
        });
    };
    return {
        post: post,
        get: get
    };
};

module.exports = bookcontroller;
