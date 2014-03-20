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
  Time: 1:36 PM
  Desc: the proxy of order
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get all product list
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getAllOrders = function (callback, pagingInfo) {
    debugProxy("proxy/order/getAllOrders");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM ORDERS " +
                               " LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM ORDERS ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getAllOrders error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get order by id
 * @param  {string}   orderId   the order id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getOrderById = function (orderId, callback) {
    debugProxy("proxy/order/getOrderById");

    orderId = orderId || "";

    if (orderId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT * FROM ORDERS " +
              " WHERE ORDER_ID = :ORDER_ID",
        params : {
            "ORDER_ID"  : orderId
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getOrderById error]: %s", err);
            return callback(new ServerError(), null);
        }

        if (rows && rows.length > 0) {
            return callback(null, rows[0]);
        } 

        return callback(null, rows);
    });
};

/**
 * create a new order
 * @param  {Object}    orderInfo the creating order info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.createOrder = function (orderInfo, callback) {
    debugProxy("proxy/order/createOrder");

    var sql = "INSERT INTO ORDERS VALUES(:ORDER_ID, :ORDER_CONTENT, :CUSTOMER_NAME, :DATETIME, :REMARK);"

    mysqlClient.query({
        sql     : sql,
        params  : orderInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[createOrder error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * modify a order
 * @param  {Object}    orderInfo the creating order info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.modifyOrder = function (orderInfo, callback) {
    debugProxy("proxy/order/modifyOrder");

    var sql = "UPDATE ORDERS SET ORDER_CONTENT = :ORDER_CONTENT, " + 
              "              CUSTOMER_NAME = :CUSTOMER_NAME, " + 
              "              DATETIME = :DATETIME, " + 
              "              REMARK = :REMARK WHERE ORDER_ID = :ORDER_ID";

    mysqlClient.query({
        sql     : sql,
        params  : orderInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[createOrder error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

