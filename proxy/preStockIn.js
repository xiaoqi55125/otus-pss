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
  Date: Mar 27, 2014
  Time: 1:46 PM
  Desc: the proxy of pre stock in
 */

var mysqlClient = require("../lib/mysqlUtil");
var async       = require("async");
var util        = require("../lib/util");

/**
 * get all pre stock in items
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getAllPreStockIns = function (callback, pagingInfo) {
    debugProxy("proxy/preStockIn/getAllPreStockIns");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM PRE_STOCK_IN " +
                               " LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM PRE_STOCK_IN ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getAllPreStockIns error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get pre stock in by id
 * @param  {string}   psiId   the pre stock in id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getPreStockInById = function (psiId, callback) {
    debugProxy("proxy/preStockIn/getPreStockInById");

    psiId = psiId || "";

    if (psiId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT * FROM PRE_STOCK_IN P " +
              " WHERE PSI_ID = :PSI_ID",
        params : {
            "PSI_ID"  : psiId
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getPreStockInById error]: %s", err);
            return callback(new ServerError(), null);
        }

        if (rows && rows.length > 0) {
            return callback(null, rows[0]);
        }
        
        return callback(null, null);
    });
};

/**
 * create a preStockIn
 * @param  {Object}   preStockInInfo the pre stock in info
 * @param  {Function} callback       the cb func
 * @return {null}                  
 */
exports.create = function (preStockInInfo ,callback) {
    debugProxy("proxy/preStockIn/create");

    var sql = "INSERT INTO PRE_STOCK_IN VALUES(:PSI_ID, :PSI_CONTENT, :PSI_TIME, :OPERATOR, :REMARK);"

    mysqlClient.query({
        sql       : sql,
        params    : preStockInInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[create error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * delete a preStockIn
 * @param  {String}   preStockInId the pre stock in id
 * @param  {Function} callback       the cb func
 * @return {null}                  
 */
exports.delete = function (preStockInId ,callback) {
    debugProxy("proxy/preStockIn/delete");

    var sql = "DELETE FROM PRE_STOCK_IN WHERE PSI_ID = :PSI_ID;";

    mysqlClient.query({
        sql       : sql,
        params    : {
            PSI_ID    : preStockInId
        }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[create error]: %s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * write pre stock in action to journal
 * @param {Object} journalInfo the journal info
 * @return {null} 
 */
exports.writePreStockInJournal = function (journalInfo, callback) {
    debugProxy("proxy/stockIn/writePreStockInJournal");

    async.waterfall([
        //step 1
        function (callback) {
            mysqlClient.query({
                sql   : "SELECT JT_ID FROM JOURNAL_TYPE WHERE JT_NAME = 'PRE_STOCK_IN'",
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
