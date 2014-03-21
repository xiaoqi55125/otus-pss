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
  Time: 1:35 PM
  Desc: the controller of order
 */

var Order = require("../proxy").Order;
var util     = require("../lib/util");
var config   = require("../appConfig").config;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;
var async    = require("async");
require("../lib/DateUtil");

/**
 * find all orders
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/order/findAll");

    Order.getAllOrders(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find order by orderId
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.findOne = function (req, res, next) {
    debugCtrller("controller/order/findOne");

    var orderId = req.params.orderId || "";

    try {
        check(orderId).notEmpty();
        sanitize(sanitize(orderId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Order.getOrderById(orderId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new order
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.add = function (req, res, next) {
    debugCtrller("controller/order/add");

    var orderInfo           = {};
    var productsJSonStr     = req.body.jsonStr || "";
    orderInfo.CUSTOMER_NAME = req.body.CUSTOMER_NAME || "";
    orderInfo.REMARK        = req.body.REMARK || "";

    try {
        check(productsJSonStr).notEmpty();
        //check json structure
        JSON.parse(productsJSonStr);
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    orderInfo.ORDER_ID      = util.GUID();
    orderInfo.DATETIME      = new Date().Format("yyyy-MM-dd hh:mm:ss");
    orderInfo.ORDER_CONTENT = productsJSonStr;
    orderInfo.STOCK_STATUS   = 0;                //has not stock out

    async.series([
        function (callback) {
            Order.createOrder(orderInfo, function (err, data) {
                callback(err, data);
            });
        },
        function (callback) {
            Order.writeOrderJournal(JSON.stringify(orderInfo), "C", function (err, data) {
                callback(err, data);
            });
        }
    ],  function (err, results) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK)); 
    });
    
};

/**
 * modify a order
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.modify = function (req, res, next) {
    debugCtrller("controller/order/modify");

    var orderInfo           = {};
    orderInfo.ORDER_ID      = req.body.ORDER_ID || "";
    var productsJSonStr     = req.body.jsonStr || "";
    orderInfo.CUSTOMER_NAME = req.body.CUSTOMER_NAME || "";
    orderInfo.REMARK        = req.body.REMARK || "";
    orderInfo.STOCK_STATUS   = req.body.STOCK_STATUS || 0;

    try {
        check(orderInfo.ORDER_ID).notEmpty();
        check(productsJSonStr).notEmpty();
        //check json structure
        JSON.parse(productsJSonStr);
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    orderInfo.DATETIME      = new Date().Format("yyyy-MM-dd hh:mm:ss");
    orderInfo.ORDER_CONTENT = productsJSonStr;

    async.series([
        function (callback) {
            Order.modifyOrder(orderInfo, function (err, data) {
                callback(err, data);
            });
        },
        function (callback) {
            Order.writeOrderJournal(JSON.stringify(orderInfo), "U", function (err, data) {
                callback(err, data);
            });
        }
    ],  function (err, results) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK)); 
    });
};

/**
 * find a stock status with order id
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.findStockStatus = function (req, res, next) {
    debugCtrller("controller/order/findStockStatus");

    var orderId = req.params.orderId || "";

    try {
        check(orderId).notEmpty();
        sanitize(sanitize(orderId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Order.getStockStatusByOrderId(orderId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK)); 
    });
};

/**
 * modify a stock status with order id
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.modifyStockStatus = function (req, res, next) {
    debugCtrller("controller/order/modifyStockStatus");

    var orderId   = req.params.orderId || "";
    var newStatus = req.body.STOCK_STATUS;

    try {
        check(orderId).notEmpty();
        sanitize(sanitize(orderId).trim()).xss();

        check(newStatus).notEmpty();
        sanitize(sanitize(newStatus).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Order.changeOrderStatus(orderId, newStatus, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK)); 
    });
};
