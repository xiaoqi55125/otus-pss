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
  Time: 15:15 PM
  Desc: the proxy of inventory
 */

var mysqlClient = require("../lib/mysqlUtil");
var pagingUtil  = require("../lib/pagingUtil");

/**
 * get all inventory
 * @param  {Function} callback callback func
 * @param {Object} pagingConditions the paging condition info
 * @return {null}            
 */
exports.getAllInventories = function (callback, pagingConditions) {
    debugProxy("proxy/inventory/getAllInventories");

    var params = {};

    var sql = "SELECT I.INVENTORY_ID, I.PRODUCT_ID, SUM(I.NUM) AS SUM, P.PRODUCT_NAME FROM INVENTORY I " +
              "  LEFT JOIN PRODUCT P ON I.PRODUCT_ID = P.PRODUCT_ID " +
              " GROUP BY PRODUCT_ID ";

    if (pagingConditions) {
        var pc = {
            start   : pagingConditions.pageIndex * pagingConditions.pageSize,
            end     : pagingConditions.pageSize
        };

        pagingUtil.commonPagingProcess(sql, queryConditions, pc, function (err, data) {
            if (err || !data) {
                debugProxy("[getAllInventories error]: %s", err);
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
                debugProxy("[getAllInventories error]: %s", err);
                return callback(new ServerError(), null);
            }

            return callback(null, rows);
        });
    }
        
};


/**
 * get all inventory by a product id
 * @param {String} productId the product id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getProductAllInventory = function (productId, callback, pagingInfo) {
    debugProxy("proxy/inventory/getProductAllInventory");

    var sql = "";
    var params = {
        PRODUCT_ID    : productId
    };

    if (pagingInfo) {
        sql                  = "SELECT * FROM INVENTORY I " +
                               " WHERE PRODUCT_ID = :PRODUCT_ID " +
                               " LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM INVENTORY I WHERE PRODUCT_ID = :PRODUCT_ID ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getProductAllInventory error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get a product num with product id
 * @param {String} productId the product id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getProductNumWithId = function (productId, callback) {
    debugProxy("proxy/inventory/getProductNumWithId");

    mysqlClient.query({
        sql   : "SELECT SUM(NUM) AS NUM FROM INVENTORY WHERE PRODUCT_ID = :PRODUCT_ID GROUP BY PRODUCT_ID",
        params: {
            PRODUCT_ID    : productId
        }
    },  function (err, rows) {
        if (err) {
            debugProxy("[getProductNumWithId error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows[0]['NUM']);
    });
};

/**
 * get a product with batch-num's num 
 * @param {String} productId the product id
 * @param {String} batchNum the product's batch number
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getNumWithProductIdAndBatchNum = function (productId, batchNum, callback) {
    debugProxy("proxy/inventory/getNumWithProductIdAndBatchNum");

    mysqlClient.query({
        sql   : "SELECT NUM FROM INVENTORY WHERE PRODUCT_ID = :PRODUCT_ID AND BATCH_NUM = :BATCH_NUM",
        params: {
            PRODUCT_ID    : productId,
            BATCH_NUM     : batchNum
        }
    },  function (err, rows) {
        if (err) {
            debugProxy("[getProductNumWithId error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows[0]['NUM']);
    });
};