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

    var productsJSonStr = req.body.jsonStr || "";
    var orderId         = req.body.orderId || "";

    try {
        check(productsJSonStr).notEmpty();
        sanitize(sanitize(productsJSonStr).trim()).xss();

        check(orderId).notEmpty();
        sanitize(sanitize(orderId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var productsJsonObj = JSON.parse(productsJSonStr);
    var serial_num      = util.GUID();
    
    var warppedObjArr = productsJsonObj.data.map(function (item) {
        item.ORDER_ID   = orderId;
        item.SO_ID      = util.GUID();
        item.SO_DATE    = new Date().Format("yyyy-MM-dd hh:mm:ss");
        return item;
    });

    var stockOutInfo = {};
    stockOutInfo.productList = warppedObjArr;

    async.waterfall([
        //step 1:
        function (callback) {
            StockOut.doStockOut(stockOutInfo, function (err, data) {
                callback(err);
            });
        },
        //step 2:     //change order status
        function (callback) {
            Order.changeOrderStatus(orderId, 2, req.session.user.userId || "", function (err, data) {
                callback(err);
            });
        },
        //step 3:
        function (callback) {
            StockOut.writeStockOutJournal({ orderId : orderId, operator : req.session.user.userId }, function (err, data) {
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

/**
 * find stock out info by order id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findByOrder = function (req, res, next) {
    debugCtrller("controller/stockOut/findByOrder");

    var orderId = req.params.orderId || "";

    try {
        check(orderId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockOut.getStockoutsByOrderId(orderId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};