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
                    insertIntoStockIn(this.conn, product, callback);
                }
            };

            //invoke async with binding a context,
            //more details : https://github.com/caolan/async#binding-a-context-to-an-iterator
            async.mapSeries(stockInInfo.productList, context.processor.bind(context), 
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
 * write stock in action to journal
 * @param {String} journalContent the content of journal
 * @return {null} 
 */
exports.writeStockInJournal = function (journalContent, callback) {
    debugProxy("proxy/stockIn/writeStockInJournal");

    async.waterfall([
        //step 1
        function (callback) {
            mysqlClient.query({
                sql   : "SELECT JT_ID FROM JOURNAL_TYPE WHERE JT_NAME = 'STOCK_IN'",
                params : null
            }, function (err, rows) {
                return callback(err, rows[0]['JT_ID']);
            });
        },
        //step 2
        function (JT_ID, callback) {
            mysqlClient.query({
                sql     : "INSERT INTO JOURNAL VALUES(:JOURNAL_ID, :JT_ID, :JOURNAL_CONTENT, :DATETIME, :REMARK)",
                params  : {
                    JOURNAL_ID      : util.GUID(),
                    JT_ID           : JT_ID,
                    JOURNAL_CONTENT : journalContent,
                    DATETIME        : new Date().Format("yyyy-MM-dd hh:mm:ss"),
                    REMARK          : ""
                }
            },  function (err, rows) {
                return callback(err, null);
            });
        }
    ],  function (err, result) {
        if (err) {
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

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
              "                             :NUM, " +
              "                             :AMOUNT, " +
              "                             :SUPPLIER, " +
              "                             :SI_DATE, " +
              "                             :SERIAL_NUM, " +
              "                             :REMARK);";
  
    conn.query(sql, productInfo, function (err, rows) {
        if (err) {
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};