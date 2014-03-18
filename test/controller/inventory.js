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
  Date: Mar 17, 2014
  Time: 13:42 AM
  Desc: the test of inventory
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");

describe('test for /controller/inventory.js', function () {
    it('is testing func: /inventories', function (done) {
        request(app).get("/inventories").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

});