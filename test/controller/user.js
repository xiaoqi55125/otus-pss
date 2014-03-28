/*
  #!/usr/bin/env node
  -*- coding:utf-8 -*-
 
  Copyright 2013 freedom Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ---
  Created with Sublime Text 2.
  Date: Mar 13, 2014
  Time: 15:15 PM
  Desc: the test of inventory
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");
var MD5     = require("crypto-js/md5");

describe('test for /controller/user.js', function () {

    // it('is testing func: /users', function (done) {
    //     request(app).get("/users").expect(200).end(function (err, res) {
    //         if (err) {
    //             return done(err);
    //         }

    //         should(res.body).have.property("statusCode", 0);

    //         done();
    //     });
        
    // });

    // it('is testing func: /users/:userId', function (done) {
    //     request(app).get("/users/12345678").expect(200).end(function (err, res) {
    //         if (err) {
    //             return done(err);
    //         }

    //         should(res.body).have.property("statusCode", 0);
    //         should(res.body.data).have.property("USER_NAME", "admin");

    //         done();
    //     });
    // });

    it('is testing func: /users', function (done) {
        var param = {
            USER_ID   : "kobe1",
            USER_NAME : "Kobe Bryant",
            PASSWORD  : MD5("12345678").toString(),
            REMARK    : "test"
        };

        request(app).post("/users").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /users/:userId', function (done) {
        var param = {
            USER_ID   : "kobe",
            USER_NAME : "admin",
            PASSWORD  : MD5("12345678").toString(),
            REMARK    : "test"
        }

        request(app).put("/users/kobe").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /signin', function(done) {
        var encrptPasswd = MD5("12345678").toString()
        debugTest("encrpt passwd:" + encrptPasswd);
        var param = {
            auth    : {
                userId    : "admin",
                passwd    : encrptPasswd
            }
        };

        request(app).post("/signin").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            done();
        });
    });

});
