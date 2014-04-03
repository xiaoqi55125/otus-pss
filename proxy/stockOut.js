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
  Desc: the proxy of stock out
 */

var mysqlClient = require("../lib/mysqlUtil");
var async       = require("async");
var util        = require("../lib/util");
require("../lib/DateUtil");

/**
 * get stock out items by order id
 * @param  {string}   productId   the product id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getStockoutsByOrderId = function (orderId, callback) {
    debugProxy("proxy/stockOut/getStockoutsByOrderId");

    orderId = orderId || "";

    if (orderId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT * FROM STOCK_OUT " +
              " WHERE ORDER_ID = :ORDER_ID",
        params : {
            "ORDER_ID"  : orderId
        }
    }, function (err, rows) {
        if (err || !rows) {
            debugProxy("[getStockoutsByOrderId error]: %s", err);
            return callback(new ServerError(), null);
        }
        
        return callback(null, rows);
    });
};


/**
 * do stock out with transaction
 * @param  {Object}   stockOutInfo the stock out info
 * @param  {Function} callback  the cb func
 * @return {null}             
 */
exports.doStockOut = function (stockOutInfo, cb) {
    debugProxy("proxy/stockOut/doStockOut");

    mysqlClient.processTransaction(function (conn) {
        if (!conn) {
            return cb(new DBError(), null);
        }

        conn.beginTransaction(function (err) {
            if (err) {
                throw err;
            }

            var context = {
                conn      : conn,
                processor : function (product, callback) {
                    stockOutOneProduct(this.conn, product, callback);
                }
            };

            //invoke async with binding a context,
            //more details : https://github.com/caolan/async#binding-a-context-to-an-iterator
            async.mapSeries(stockOutInfo.productList, context.processor.bind(context), 
                function (err, result) {
                    debugProxy("enter final cb");
                    if (err) {
                        conn.rollback(function () {
                            return cb(new DBError(), null);
                        });
                    }

                    conn.commit(function (err) {
                        if (err) {
                            debugProxy(err);
                            conn.rollback(function () {
                                return cb(new DBError(), null);
                            });
                        }

                        return cb(null, null);
                    });
            });
        });
    });
};

/**
 * write stock out action to journal
 * @param {Object} journalInfo the journal info
 * @return {null} 
 */
exports.writeStockOutJournal = function (journalInfo, callback) {
    debugProxy("proxy/stockOut/writeStockOutJournal");

    async.waterfall([
        //step 1
        function (callback) {
            mysqlClient.query({
                sql   : "SELECT JT_ID FROM JOURNAL_TYPE WHERE JT_NAME = 'STOCK_OUT'",
                params : null
            }, function (err, rows) {
                return callback(err, rows[0]['JT_ID']);
            });
        },
        function (JT_ID, callback) {
            mysqlClient.query({
                sql     : "INSERT INTO JOURNAL VALUES(:JOURNAL_ID, :JT_ID, :JOURNAL_CONTENT, :OPERATOR, :DATETIME, :REMARK)",
                params  : {
                    JOURNAL_ID      : util.GUID(),
                    JT_ID           : JT_ID,
                    JOURNAL_CONTENT : journalInfo.orderId,
                    OPERATOR        : journalInfo.operator,
                    DATETIME        : new Date().Format("yyyy-MM-dd hh:mm:ss"),
                    REMARK          : ""
                }
            },  function (err, rows) {
                return callback(err, null);
            });
        }
    ],  function (err, result) {
        if (err) {
            debugProxy("[writeStockOutJournal error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
    
};

/**
 * stock out one product
 * @param  {Object}   conn        the mysql's connection
 * @param  {Object}   productInfo one product info
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
function stockOutOneProduct (conn, productInfo, callback) {
    debugProxy("proxy/stockOut/stockOutOneProduct");

    async.series([
        //step 1
        function (callback) {
            validateInventoryNum(conn, productInfo, function (err) {
                callback(err, null);
            });
        },
        //step 2
        function (callback) {
            insertIntoStockOut(conn, productInfo, function (err) {
                callback(err, null);
            });
        }
    ],  function (err, values) {
        if (err) {
            debugProxy("[stockOutOneProduct error]: %s", err);
            return callback(err, null);
        }

        return callback(null, null);
    });
};


/**
 * validate inventory num
 * @param  {Object}   conn         the mysql's connection
 * @param  {Object}   productInfo the product info
 * @param  {Function} callback     the cb func
 * @return {null}                
 */
function validateInventoryNum (conn, productInfo, callback) {
    debugProxy("proxy/stockOut/validateInventoryNum");

    var sql = "SELECT COUNT(1) AS cnt FROM otusDB.INVENTORY WHERE PRODUCT_ID = :PRODUCT_ID AND BATCH_NUM = :BATCH_NUM AND NUM >= :NUM; "
    conn.query(sql, productInfo, function (err, rows) {
        if (err || !rows || rows[0]['cnt'] == 0) {
            debugProxy("[validateInventoryNum error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * insert stock out
 * @param  {Object}   conn        the mysql's connection
 * @param  {Object}   productInfo the product info
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
function insertIntoStockOut (conn, productInfo, callback) {
    debugProxy("proxy/stockOut/insertIntoStockOut");

    var sql = "INSERT INTO STOCK_OUT(SO_ID, PRODUCT_ID, BATCH_NUM, NUM, OPERATOR, SO_DATE, ORDER_ID, REMARK) " +
              " VALUES                     (:SO_ID, " +
              "                             :PRODUCT_ID, " +
              "                             :BATCH_NUM," +
              "                             :NUM, " +
              "                             :OPERATOR, " +
              "                             :SO_DATE, " +
              "                             :ORDER_ID, " +
              "                             :REMARK);";
  
    conn.query(sql, productInfo, function (err, rows) {
        if (err) {
            debugProxy("[insertIntoStockOut error] :%s", err);
            conn.rollback(function () {
                return callback(new DBError(), null);
            });
        }

        return callback(null, null);
    });
};

