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
  Time: 11:48 AM
  Desc: the controller of stock out
 */

var StockOut = require("../proxy").StockOut;
var Order    = require("../proxy").Order;
var util     = require("../lib/util");
var config   = require("../appConfig").config;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;
var async    = require("async");
require("../lib/DateUtil");

/**
 * add a new stock out
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.stockOut = function (req, res, next) {
    debugCtrller("controller/stockOut/stockOut");

    var orderId = req.body.orderId || "";

    try {
        check(orderId).notEmpty();
        sanitize(sanitize(orderId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    async.waterfall([
        //step 1:
        function (callback) {
            //get order by id
            Order.getOrderById(orderId, function (err, data) {
                if (err || !data) {
                    return callback(err, null);
                } else {
                    var productsJsonObj = JSON.parse(data["ORDER_CONTENT"]);

                    var warppedObjArr = productsJsonObj.data.map(function (item) {
                        item.ORDER_ID   = orderId;
                        item.SO_ID      = util.GUID();
                        item.SO_DATE    = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        return item;
                    });

                    var stockOutInfo = {};
                    stockOutInfo.productList = warppedObjArr;
                    return callback(err, stockOutInfo);
                }
            });
        },
        //step 2:
        function (stockOutInfo, callback) {
            StockOut.doStockOut(stockOutInfo, function (err, data) {
                callback(err);
            });
        },
        //step 3:     //change order status
        function (callback) {
            Order.changeOrderStatus(orderId, 1, function (err, data) {
                callback(err);
            });
        },
        //step 4:
        function (callback) {
            StockOut.writeStockOutJournal(orderId, function (err, data) {
                callback(err, null);
            });
        }
    ],  function (err, values) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};