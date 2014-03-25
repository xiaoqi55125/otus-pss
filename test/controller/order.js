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
  Date: Mar 20, 2014
  Time: 2:02 PM
  Desc: the test of order
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");
require("../../lib/DateUtil");

describe('test for /controller/order.js', function () {

    it('is testing func: /orders', function (done) {
        request(app).get("/orders?from_dt=2014-03-24 09:18:18&to_dt=2014-03-24 12:00:00").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /orders/:orderId', function (done) {
        request(app).get("/orders/12345678").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);
            should(res.body.data).have.property("ORDER_ID","12345678");

            done();
        });
    });

    // it('is testing func: /orders', function(done) {
    //     var jsonStr = '{ "data" : [' +
    //     '{"PRODUCT_ID":"12345678", "NUM":3, "AMOUNT":2000, "OPERATOR":"12345678", "REMARK":""},' +
    //     '{"PRODUCT_ID":"43890f6c-eb7f-d253-14c4-36d44ffeb265", "NUM":10, "AMOUNT":5000, "OPERATOR":"12345678", "SO_DATE":"2014-03-18 01:01:01", "REMARK":""}' +
    //     ']}';
        
    //     var params = {
    //         jsonStr         : jsonStr,
    //         CUSTOMER_NAME   : "杨华hot tokyo株式会社",
    //         REMARK          : ""
    //     };

    //     request(app).post("/orders").send(params).expect(200).end(function (err, res) {
    //         if (err) {
    //             return done(err);
    //         }

    //         should(res.body).have.property("statusCode", 0);

    //         done();
    //     });
    // });

    it('is testing func: /orders', function(done) {
        var jsonStr = '{ "data" : [' +
        '{"PRODUCT_ID":"43890f6c-eb7f-d253-14c4-36d44ffeb265", "NUM":10, "AMOUNT":5000, "OPERATOR":"12345678", "SO_DATE":"2014-03-18 01:01:01", "REMARK":""}' +
        ']}';
        
        var params = {
            jsonStr         : jsonStr,
            CUSTOMER_NAME   : "志程必败有限公司!",
            REMARK          : "test",
            ORDER_ID        : "12345678"
        };

        request(app).put("/orders").send(params).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /orders/:orderId/stockstatus', function(done) {
        request(app).get("/orders/12345678/stockstatus").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /orders/:orderId/stockstatus', function(done) {
        
        var params = {
            STOCK_STATUS    : 2,
            ORDER_ID        : "12345678"
        };

        request(app).put("/orders/12345678/stockstatus").send(params).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

});

