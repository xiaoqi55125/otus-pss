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
  Date: Mar 27, 2014
  Time: 2:10 PM
  Desc: the test of pre stock in
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");
require("../../lib/DateUtil");

describe('test for /controller/preStockIn.js', function () {

    it('is testing func: /prestockins', function (done) {
        request(app).get("/prestockins").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

    it('is testing func: /prestockins/:psiId', function (done) {
        request(app).get("/prestockins/12345678").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

    it('is testing func: /prestockins', function (done) {
        var jsonStr = '{ "data" : [' +
        '{"PRODUCT_ID":"12345678", "BATCH_NUM":"0987654321", "NUM":3, "AMOUNT":2000, "SUPPLIER":"MICROSOFT", "REMARK":""},' +
        '{"PRODUCT_ID":"43890f6c-eb7f-d253-14c4-36d44ffeb265", "BATCH_NUM":"0987654321", "NUM":10, "AMOUNT":5000, "SUPPLIER":"APPLE", "SI_DATE":"2014-03-18 01:01:01", "REMARK":""}' +
        ']}';
        var param = {
            jsonStr   : jsonStr
        };

        request(app).post("/prestockins").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

});

