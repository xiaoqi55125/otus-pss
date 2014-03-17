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
  Time: 10:18 AM
  Desc: the test of product
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");
var util    = require("../../lib/util");
require("../../lib/DateUtil");

describe('test for /controller/product.js', function () {

    it('is testing func: /products', function (done) {
        request(app).get("/products").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
        
    });

    it('is testing func: /products/:productId', function (done) {
        request(app).get("/products/12345678").expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);
            should(res.body.data).have.property("PRODUCT_NAME", "MAC_BOOK");

            done();
        });
    });

    it('is testing func: /products', function (done) {
        var param = {
            PRODUCT_ID        : util.GUID(),
            PRODUCT_NAME      : util.GUID(),
            PRICE             : 5000,
            MANUFACTURE_NAME  : "Microsoft",
            MANUFACTURE_DATE  : new Date().Format("yyyy-MM-dd hh:mm:ss"),
            PC_ID             : "12345678"
        };

        request(app).post("/products").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    it('is testing func: /products/:pcId', function (done) {
        var param = {
            PC_ID             : 12345678,
            PRODUCT_NAME      : "admin",
            PRICE             : "12345",
            MANUFACTURE_NAME  : "Microsoft",
            MANUFACTURE_DATE  : new Date().Format("yyyy-MM-dd hh:mm:ss"),
            PC_ID             : "12345678"
        }

        request(app).put("/products/12345678").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            should(res.body).have.property("statusCode", 0);

            done();
        });
    });

    // it('is testing func: /products/:pcId/products', function (done) {
    //     request(app).get("/products/12345678/products").expect(200).end(function (err, res) {
    //         if (err) {
    //             return done(err);
    //         }

    //         should(res.body).have.property("statusCode", 0);

    //         done();
    //     });
    // });

});