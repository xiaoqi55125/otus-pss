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
  Date: Mar 31, 2014
  Time: 10:51 AM
  Desc: the test of security
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");

describe('test for /controller/security.js', function () {

    it('is testing func: /securitygroups', function (done) {
        request(app).get("/securitygroups").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

    // it('is testing func: /usersecuritygroups', function (done) {

    //     var params = {
    //         userId    : util.GUID(),
    //         groupId   : util.GUID()
    //     };

    //     request(app).post("/usersecuritygroups").send(params).expect(200).end(function (err, res) {
    //         if (err) {
    //             return done(err);
    //         }

    //         should(res.body).have.property("statusCode", 0);

    //         done();
    //     });
        
    // });

    // it('is testing func: /usersecuritygroups/:userId/:groupId', function (done) {

    //     request(app).put("/usersecuritygroups/abcd/12345").expect(200).end(function (err, res) {
    //         if (err) {
    //             return done(err);
    //         }

    //         should(res.body).have.property("statusCode", 0);

    //         done();
    //     });
        
    // });

    it('is testing func: /users/:userId/permissions', function (done) {

        request(app).get("/users/abcd/permissions").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

    it('is testing func: /users/:userId/securitygroups', function (done) {

        request(app).get("/users/abcd/securitygroups").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

});

