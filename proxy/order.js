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
var async       = require("async");
var util        = require("../lib/util");
var pagingUtil  = require("../lib/pagingUtil");

/**
 * get all product list
 * @param {Object} queryConditions sql query condition
 * @param  {Function} callback callback func
 * @param {Object} pagingConditions the paging info
 * @return {null}            
 */
exports.getAllOrders = function (queryConditions, callback, pagingConditions) {
    debugProxy("proxy/order/getAllOrders");

    var sql = " SELECT * FROM ORDERS WHERE 1 = 1 ";
    var params = {};

    if (queryConditions) {
        if (queryConditions.from_dt && queryConditions.to_dt) {
            sql += (' AND DATETIME BETWEEN "' + queryConditions.from_dt + '" AND "' + queryConditions.to_dt + '"');
        } else if (queryConditions.from_dt) {
            sql += (' AND DATETIME >= "' + queryConditions.from_dt + '"');
        } else if (queryConditions.to_dt) {
            sql += (' AND DATETIME <= "' + queryConditions.to_dt + '"');
        }

        if (queryConditions.status) {
            sql += (' AND STOCK_STATUS = ' + queryConditions.status);
        }
    }

    //order
    sql += " ORDER BY STOCK_STATUS,DATETIME DESC";

    if (pagingConditions) {
        var pc = {
            start   : pagingConditions.pageIndex * pagingConditions.pageSize,
            end     : pagingConditions.pageSize
        };

        pagingUtil.commonPagingProcess(sql, params, pc, function (err, data) {
            if (err || !data) {
                debugProxy("[getAllOrders error]: %s", err);
                return callback(new ServerError(), null);
            }

            data.pagingInfo.pageIndex     = pagingConditions.pageIndex;
            data.pagingInfo.pageSize      = pagingConditions.pageSize;

            return callback(null, data);
        });
    } else {
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
    }

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
              " WHERE ORDER_ID = :ORDER_ID ",
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
 * get order stock status by id
 * @param  {string}   orderId   the order id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getStockStatusByOrderId = function (orderId, callback) {
    debugProxy("proxy/order/getStockStatusByOrderId");

    orderId = orderId || "";

    if (orderId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT STOCK_STATUS FROM ORDERS " +
              " WHERE ORDER_ID = :ORDER_ID ",
        params : {
            "ORDER_ID"  : orderId
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getStockStatusByOrderId error]: %s", err);
            return callback(new ServerError(), null);
        }

        if (rows && rows.length > 0) {
            return callback(null, rows[0]['STOCK_STATUS']);
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

    var sql = "INSERT INTO ORDERS VALUES(:ORDER_ID, :ORDER_CONTENT, :CUSTOMER_NAME, :DATETIME, :STOCK_STATUS, :REMARK);"

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
              "              STOCK_STATUS = :STOCK_STATUS, " + 
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

/**
 * change order status
 * @param {String} orderId the order's id
 * @param  {Number}   newStatus the order's new status
 * @param  {Function} callback  the cb func
 * @return {null}             
 */
exports.changeOrderStatus = function (orderId, newStatus, callback) {
    debugProxy("proxy/order/changeOrderStatus");

    if (!orderId || !newStatus) {
        return callback(new DBError(), null);
    }

    var sql = "UPDATE ORDERS SET STOCK_STATUS = :STOCK_STATUS " + 
              "               WHERE ORDER_ID = :ORDER_ID";

    mysqlClient.query({
        sql     : sql,
        params  : {
            STOCK_STATUS    : newStatus,
            ORDER_ID        : orderId
        }
    },  function (err, rows) {
        if (err) {
            debugProxy("[createOrder error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * write order action to journal
 * @param {Object} journalInfo the journal info
 * @return {null} 
 */
exports.writeOrderJournal = function (journalInfo, callback) {
    debugProxy("proxy/order/writeOrderJournal");

    async.waterfall([
        //step 1
        function (callback) {
            mysqlClient.query({
                sql   : "SELECT JT_ID FROM JOURNAL_TYPE WHERE JT_NAME = 'ORDERS'",
                params : null
            }, function (err, rows) {
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
                    REMARK          : journalInfo.status
                }
            },  function (err, rows) {
                return callback(err, null);
            });
        }
    ],  function (err, result) {
        if (err) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
    
};

/**
 * remove order item by orderId
 * @param  {String}   orderId  the order's id
 * @param {String} stockStatus the order's status
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.removeById = function (orderId, stockStatus, callback) {
    debugProxy("proxy/order/removeById");

    var sql = "DELETE FROM ORDERS WHERE ORDER_ID = :ORDER_ID AND STOCK_STATUS = :STOCK_STATUS ";
    mysqlClient.query({
        sql         : sql,
        params      : {
            ORDER_ID    : orderId,
            STOCK_STATUS: stockStatus
        }
    },  function (err, rows) {
        if (err || rows.affectedRows === 0) {
            debugProxy("[removeById error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

