var server, request, assert, validResponse, _, nock;

server = require('../server');
request = require('supertest');
assert = require('assert');
_ = require('lodash');
nock = require('nock');

describe('The Books /Api ', function () {
  describe('When /Books Is Hit', function () {
    beforeEach(function () {
      validResponse = [
        {
          _id: "5771078e0a5f438d90501345",
          title: "War and Peace",
          genre: "Historical Fiction",
          author: "Lev Nikolayevich Tolstoy",
          read: false
        },
        {
          _id: "5771078e0a5f438d90501346",
          title: "Les Misérables",
          genre: "Historical Fiction",
          author: "Victor Hugo",
          read: false
        }];
    });
    
    it('Returns with List of Books', function (done) {
      var scope = nock('http://localhost:8000')
        .persist()
        .get('/api/books/')
        .reply(200, validResponse);
        console.log("high --1");
      request(server)
        .get('/api/books/')
        .end(function (err, res) {
          console.log("high --2");
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('Returns Particular Book by /Book:id', function () {
      var scope = nock('http://localhost:8000/')
        .persist()
        .get('/api/books/5771078e0a5f438d90501346')
        .reply(200, _.find(validResponse, ['_id', '5771078e0a5f438d90501346']));
      request(server)
        .get('/api/books/5771078e0a5f438d90501346')
        .end(function (err, res) {
          assert.ok(_.find(res.body, ['author', "Victor Hugo"]));
          assert.equal(res.statusCode, 200);
          done();
        });
    });
  });
});