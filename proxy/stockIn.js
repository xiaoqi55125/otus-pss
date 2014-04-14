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
  Desc: the proxy of stock in
 */

var mysqlClient = require("../lib/mysqlUtil");
var async       = require("async");
var util        = require("../lib/util");
require("../lib/DateUtil");

/**
 * do stock in with transaction
 * @param  {Object}   stockInInfo the stock in info
 * @param  {Function} callback  the cb func
 * @return {null}             
 */
exports.doStockIn = function (stockInInfo, cb) {
    debugProxy("proxy/stockIn/doStockIn");

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
                    stockInOneProduct(this.conn, product, callback);
                }
            };

            //invoke async with binding a context,
            //more details : https://github.com/caolan/async#binding-a-context-to-an-iterator
            async.mapSeries(stockInInfo.productList, context.processor.bind(context), 
                function (err, result) {
                    debugProxy("enter final cb");
                    if (err) {
                        debugProxy(err);
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
 * write stock in action to journal
 * @param {Object} journalInfo the journal info
 * @return {null} 
 */
exports.writeStockInJournal = function (journalInfo, callback) {
    debugProxy("proxy/stockIn/writeStockInJournal");

    async.waterfall([
        //step 1
        function (callback) {
            mysqlClient.query({
                sql   : "SELECT JT_ID FROM JOURNAL_TYPE WHERE JT_NAME = 'STOCK_IN'",
                params : null
            }, function (err, rows) {
                debugProxy("[writeStockInJournal step 1]: %s", err);
                return callback(err, rows[0]['JT_ID']);
            });
        },
        //step 2
        function (JT_ID, callback) {
            mysqlClient.query({
                sql     : "INSERT INTO JOURNAL VALUES(:JOURNAL_ID, :JT_ID, :JOURNAL_CONTENT, :OPERATOR, :DATETIME, :REMARK)",
                params  : {
                    JOURNAL_ID      : util.GUID(),
                    JT_ID           : JT_ID,
                    JOURNAL_CONTENT : journalInfo.journalContent,
                    OPERATOR        : journalInfo.operator,
                    DATETIME        : new Date().Format("yyyy-MM-dd hh:mm:ss"),
                    REMARK          : ""
                }
            },  function (err, rows) {
                debugProxy("[writeStockInJournal step 2]: %s", err);
                return callback(err, null);
            });
        }
    ],  function (err, result) {
        if (err) {
            debugProxy("[writeStockInJournal error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * stock in one product
 * @param  {Object}   conn        the mysql's connection
 * @param  {Object}   productInfo the product info
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
function stockInOneProduct (conn, productInfo, callback) {
    debugProxy("proxy/stockIn/stockInOneProduct");

    async.waterfall([
        //step 1
        function (callback) {
            checkExists(conn, productInfo, function (err, recordExists) {
                callback(err, recordExists);
            });
        },
        //step 2
        function (recordExists, callback) {
            if (!recordExists) {                    //not exists
                insertIntoStockIn(conn, productInfo, function (err) {
                    callback(err, null);
                });
            } else {
                updateStockIn(conn, productInfo, function (err) {
                    callback(err, null);
                });
            }
        }
    ],  function (err, values) {
        if (err) {
            debugProxy("[stockOutOneProduct error]: %s", err);
            return callback(err, null);
        }

        return callback(null, null);
    });
}

/**
 * check a stock in product is exists
 * @param  {Object}   conn        the connection object
 * @param  {Object}   productInfo the product info
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
function checkExists (conn, productInfo, callback) {
    debugProxy("proxy/stockIn/checkExists");

    var sql = " SELECT COUNT(1) AS CNT FROM STOCK_IN WHERE PRODUCT_ID = :PRODUCT_ID AND BATCH_NUM = :BATCH_NUM ";

    conn.query(sql, productInfo, function (err, rows) {
        if (err || !rows[0]) {
            debugProxy("[checkExists error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(err, rows[0]['CNT'].toString() === "0" ? false : true);
    })
}


/**
 * insert stock in
 * @param  {Object}   conn        the mysql's connection
 * @param  {Object}   productInfo the product info
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
function insertIntoStockIn (conn, productInfo, callback) {
    debugProxy("proxy/stockIn/insertIntoStockIn");

    var sql = "INSERT INTO STOCK_IN VALUES( :SI_ID, " +
              "                             :PRODUCT_ID, " +
              "                             :BATCH_NUM," +
              "                             :NUM, " +
              "                             :PRICE, " +
              "                             :SUPPLIER, " +
              "                             :SI_DATE, " +
              "                             :SERIAL_NUM, " +
              "                             :REMARK);";
  
    conn.query(sql, productInfo, function (err, rows) {
        if (err) {
            debugProxy("[insertIntoStockIn error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * update a exist stock in item
 * @param  {Object}   conn        the mysql's connection
 * @param  {Object}   productInfo the product info
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
function updateStockIn (conn, productInfo, callback) {
    debugProxy("proxy/stockIn/updateStockIn");

    var sql = "UPDATE STOCK_IN SET NUM = NUM + :NUM " + 
              " WHERE PRODUCT_ID = :PRODUCT_ID AND BATCH_NUM = :BATCH_NUM";

    conn.query(sql, productInfo, function (err, rows) {
        if (err) {
            debugProxy("[updateStockIn error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
}