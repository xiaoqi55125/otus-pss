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
  Desc: the test of stock out
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");
require("../../lib/DateUtil");

describe('test for /controller/stockOut.js', function () {

    it('is testing func: /stockouts', function (done) {
        var jsonStr = '{ "data" : [' +
        '{"PRODUCT_ID":"12345678", "BATCH_NUM":"0987654321", "NUM":3, "AMOUNT":2000, "OPERATOR":"12345678", "REMARK":""},' +
        '{"PRODUCT_ID":"43890f6c-eb7f-d253-14c4-36d44ffeb265", "BATCH_NUM":"0987654321", "NUM":10, "AMOUNT":5000, "OPERATOR":"12345678", "SO_DATE":"2014-03-18 01:01:01", "REMARK":""}' +
        ']}';

        var param = {
            orderId   : "c4771585-aea2-df9b-7269-cdc90675f9af",
            jsonStr   : jsonStr
        };

        request(app).post("/stockouts").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

});