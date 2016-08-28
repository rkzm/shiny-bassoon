var should, sinon, bookController, Book;

should = require('should');
sinon = require('sinon');


describe('Book Controller Tests:', function () {
    describe('Post', function () {

        beforeEach(function () {
            Book = function () {
                this.save = function () { };
            };
            bookController = require('../controllers/bookcontroller')(Book);
        });

        it('should not allow an empty title on post', function () {
            var req = {
                body: {
                    author: 'Makena'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            bookController.post(req, res);
            res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
            res.send.calledWith('Title is required').should.equal(true);
        });

        it('should not allow an empty author on post', function () {
            var req = {
                body: {
                    title: 'Makena'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            bookController.post(req, res);
            res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
            res.send.calledWith('Author is required').should.equal(true);
        });
    });
});