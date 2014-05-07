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
  Desc: the proxy of journal
 */

var mysqlClient = require("../lib/mysqlUtil");
var pagingUtil  = require("../lib/pagingUtil");
var async       = require("async");

/**
 * multi query for journal
 * @param  {Object}   queryConditions   the query conditions
 * @param {Object} pagingConditions the paging condition info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getJournalWithQueryConditions = function (queryConditions, pagingConditions, callback) {
    debugProxy("proxy/journal/getJournalWithQueryConditions");

    var sql = 'SELECT JOURNAL.*, UL.USER_NAME, JOURNAL_TYPE.JT_NAME FROM JOURNAL ' +
              ' LEFT JOIN USER_LOGIN UL ON UL.USER_ID = JOURNAL.OPERATOR' +
              ' LEFT JOIN JOURNAL_TYPE ON JOURNAL.JT_ID = JOURNAL_TYPE.JT_ID WHERE 1 = 1 ';

    if (queryConditions) {
        if (queryConditions.jtId) {
            sql += (' AND JOURNAL.JT_ID = "' + queryConditions.jtId + '" ');
        }

        if (queryConditions.productId) {
            sql += (' AND JOURNAL_CONTENT LIKE "%' + queryConditions.productId + '%"')
        }

        if (queryConditions.from_dt && queryConditions.to_dt) {
            sql += (' AND DATETIME BETWEEN "' + queryConditions.from_dt + '" AND "' + queryConditions.to_dt + '"');
        } else if (queryConditions.from_dt) {
            SQL += (' AND DATETIME >= "' + queryConditions.from_dt + '"');
        } else if (queryConditions.to_dt) {
            SQL += (' AND DATETIME <= "' + queryConditions.to_dt + '"');
        }
    }

    sql += " ORDER BY DATETIME DESC"

    if (pagingConditions) {
        var pc = {
            start   : pagingConditions.pageIndex * pagingConditions.pageSize,
            end     : pagingConditions.pageSize
        };

        pagingUtil.commonPagingProcess(sql, queryConditions, pc, function (err, data) {
            if (err || !data) {
                debugProxy("[getJournalWithQueryConditions error]: %s", err);
                return callback(new ServerError(), null);
            }

            data.pagingInfo.pageIndex     = pagingConditions.pageIndex;
            data.pagingInfo.pageSize      = pagingConditions.pageSize;

            return callback(null, data);
        });
    } else {
        mysqlClient.query({
            sql     : sql,
            params  : queryConditions
        },  function (err, rows) {
            if (err) {
                debugProxy("[getJournalWithQueryConditions error]: %s", err);
                return callback(new ServerError(), null);
            }

            return callback(null, rows);
        });
    }
    
};

/**
 * multi query for journal
 * @param  {Object}   queryConditions   the query conditions
 * @param {Object} pagingConditions the paging condition info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getStockJournalWithQueryConditions = function (queryConditions, pagingConditions, callback) {
    debugProxy("proxy/journal/getJournalWithQueryConditions");

    var sql = ' SELECT T.*, JOURNAL_TYPE.JT_NAME FROM ' +
              ' (SELECT RELATED_ID, JT_ID, OPERATOR_NAME, OPERATE_TIME FROM STOCK_JOURNAL ' +
              ' WHERE 1 = 1 ';
              

    if (queryConditions) {
        if (queryConditions.jtId) {
            sql += (' AND STOCK_JOURNAL.JT_ID = "' + queryConditions.jtId + '" ');
        }

        if (queryConditions.productId) {
            sql += (' AND STOCK_JOURNAL.PRODUCT_ID = "' + queryConditions.productId + '" ')
        }

        if (queryConditions.from_dt && queryConditions.to_dt) {
            sql += (' AND OPERATE_TIME BETWEEN "' + queryConditions.from_dt + '" AND "' + queryConditions.to_dt + '"');
        } else if (queryConditions.from_dt) {
            SQL += (' AND OPERATE_TIME >= "' + queryConditions.from_dt + '"');
        } else if (queryConditions.to_dt) {
            SQL += (' AND OPERATE_TIME <= "' + queryConditions.to_dt + '"');
        }
    }

    sql += ' GROUP BY RELATED_ID, JT_ID , OPERATOR_NAME, OPERATE_TIME) T ' +
            ' LEFT JOIN JOURNAL_TYPE ON T.JT_ID = JOURNAL_TYPE.JT_ID ';

    sql += " ORDER BY OPERATE_TIME DESC";

    if (pagingConditions) {
        var pc = {
            start   : pagingConditions.pageIndex * pagingConditions.pageSize,
            end     : pagingConditions.pageSize
        };

        pagingUtil.commonPagingProcess(sql, queryConditions, pc, function (err, data) {
            if (err || !data) {
                debugProxy("[getJournalWithQueryConditions error]: %s", err);
                return callback(new ServerError(), null);
            }

            data.pagingInfo.pageIndex     = pagingConditions.pageIndex;
            data.pagingInfo.pageSize      = pagingConditions.pageSize;

            return callback(null, data);
        });
    } else {
        mysqlClient.query({
            sql     : sql,
            params  : queryConditions
        },  function (err, rows) {
            if (err) {
                debugProxy("[getJournalWithQueryConditions error]: %s", err);
                return callback(new ServerError(), null);
            }

            return callback(null, rows);
        });
    }
    
};

/**
 * get stock statistics with query condition
 * @param  {Object}   queryConditions the query condition 
 * @param  {Function} callback        the cb func
 * @return {null}                   
 */
exports.getStockStatisticsWithQueryConditions = function (queryConditions, callback) {
    debugProxy("proxy/journal/getStockStatisticsWithQueryConditions");

    var sql = " SELECT SUM(NUM) AS 'sum', JOURNAL_TYPE.JT_ID, JOURNAL_TYPE.JT_NAME  FROM STOCK_JOURNAL " +
              " LEFT JOIN JOURNAL_TYPE ON STOCK_JOURNAL.JT_ID = JOURNAL_TYPE.JT_ID " +
              ' WHERE 1 = 1 ';
              

    if (queryConditions) {
        if (queryConditions.jtId) {
            sql += (' AND STOCK_JOURNAL.JT_ID = "' + queryConditions.jtId + '" ');
        }

        if (queryConditions.productId) {
            sql += (' AND STOCK_JOURNAL.PRODUCT_ID = "' + queryConditions.productId + '" ')
        }

        if (queryConditions.from_dt && queryConditions.to_dt) {
            sql += (' AND OPERATE_TIME BETWEEN "' + queryConditions.from_dt + '" AND "' + queryConditions.to_dt + '"');
        } else if (queryConditions.from_dt) {
            SQL += (' AND OPERATE_TIME >= "' + queryConditions.from_dt + '"');
        } else if (queryConditions.to_dt) {
            SQL += (' AND OPERATE_TIME <= "' + queryConditions.to_dt + '"');
        }
    }

    sql += ' GROUP BY STOCK_JOURNAL.JT_ID ';

    mysqlClient.query({
        sql     : sql,
        params  : queryConditions
    },  function (err, rows) {
        if (err) {
            debugProxy("[getJournalWithQueryConditions error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get journal items with related id
 * @param  {String}   relatedId the related id assocated with current journal (serial number)
 * @param  {Function} callback  the cb func
 * @return {null}             
 */
exports.getJournalsWithRelatedId = function (relatedId, callback) {
    debugProxy("proxy/journal/getJournalsWithRelatedId");

    var sql = " SELECT * FROM STOCK_JOURNAL WHERE RELATED_ID = :RELATED_ID ";
    mysqlClient.query({
        sql     : sql,
        params  : {
            RELATED_ID  : relatedId
        }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[getJournalsWithRelatedId error] : %s ", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get journal type id with journal name
 * @param  {String}   jt_name  journal type name
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.getJournalTypeId = function (jt_name, callback) {
    debugProxy("proxy/journal/getJournalTypeId");

    mysqlClient.query({
        sql   : "SELECT JT_ID FROM JOURNAL_TYPE WHERE JT_NAME = :JT_NAME",
        params : {
            JT_NAME   : jt_name
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getJournalTypeId] error : " + err);
            return callback(new DBError(), null);
        }

        return callback(err, rows[0]['JT_ID']);
    });
};

/**
 * write stock in / out journal 
 * @param  {Object}   stockJournalArr the stock journal
 * @param  {Function} callback     the cb func
 * @return {null}                
 */
exports.writeStockJournal = function (stockJournalArr, callback) {
    debugProxy("proxy/journal/writeStockJournal");

    async.mapSeries(stockJournalArr, writeStockJournalOneByOne, 
        function (err, result) {
            if (err) {
                debugProxy("[writeStockJournal error] : " + err);
                return callback(new DBError(), null);
            }

            return callback(null, null);
        }
    );
};

/**
 * write stock journal one by one
 * @param  {Object}   stockJournal the model of stock journal
 * @param  {Function} callback     the cb func
 * @return {null}               
 */
function writeStockJournalOneByOne (stockJournal, callback) {
    mysqlClient.query({
        sql     : "INSERT INTO STOCK_JOURNAL VALUES( " + 
                  "                                 :PRODUCT_ID,  " +
                  "                                 :BATCH_NUM,   " +
                  "                                 :RELATED_ID,  " +
                  "                                 :JT_ID,       " +
                  "                                 :PRODUCT_NAME," +
                  "                                 :NUM,         " +
                  "                                 :PRICE,       " +
                  "                                 :SUPPLIER,    " +
                  "                                 :OPERATOR,    " +
                  "                                 :OPERATOR_NAME," +
                  "                                 :OPERATE_TIME"  +
                  ")",
        params  : stockJournal
    },  function (err, rows) {
        if (err) {
            debugProxy("[writeStockJournalOneByOne error] : " + err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

