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
  Date: Mar 14, 2014
  Time: 14:03 PM
  Desc: the test of journal type
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");

describe('test for /controller/journalType.js', function () {

    it('is testing func: /journaltypes', function (done) {
        request(app).get("/journaltypes").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

    it('is testing func: /journaltypes', function (done) {
        var param = {
            JT_ID   : util.GUID(),
            JT_NAME : util.GUID(),
            REMARK  : "test"
        };

        request(app).post("/journaltypes").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /journaltypes/:jtId', function (done) {
        var param = {
            JT_ID     : 12345678,
            JT_NAME   : "default",
            REMARK    : "MODIFIED"
        }

        request(app).put("/journaltypes/12345678").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

});