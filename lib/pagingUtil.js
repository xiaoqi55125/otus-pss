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
  Date: Apr 3, 2014
  Time: 3:19 PM
  Desc: the util of data paging
 */

var async       = require('async');
var mysqlClient = require("../lib/mysqlUtil");

/**
 * a common util method to process simple sql-paging,
 * Note: it supports paramed-query with format like : `:ID`
 * @param  {String}   sqlWithoutPaging the query sql without paging statement(eg:limit...)
 * @param  {Object}   sqlCondition     if param-query then give params otherwise set null
 * @param  {Object}   pagingCondition  paging condition object, contain two params:
 *                                     * start      - item start index
 *                                     * end        - item end index
 * @param  {Function} callback         the callback func with two properties:
 *                                     * items      - data set
 *                                     * pagingInfo - paging info
 * @return {null}                    
 */
exports.commonPagingProcess = function (sqlWithoutPaging, sqlCondition, pagingCondition, callback) {
    if (!sqlWithoutPaging) {
        return callback(new Error("paing sql can not be empty"), null);
    }

    var needPaging = true;
    if (!pagingCondition || !pagingCondition.start || !pagingCondition.end) {
        needPaging = false;
    }

    var sql    = needPaging ? sqlWithoutPaging + " LIMIT :START, :END" : sqlWithoutPaging;
    var params = sqlCondition ? sqlCondition : {};
    var result = {};

    if (needPaging) {
        params.START = pagingCondition.start;
        params.END   = pagingCondition.end;
    }

    async.series([
        //step 1: get paging data
        function (callback) {
            mysqlClient.query({
                sql     : sql,
                params  : params
            },  function (err, rows) {
                if (err || !rows) {
                    return callback(new DBError(), null);
                }

                //setting data set
                result.items = rows;

                return callback(null, null);
            });
        },
        //step 2: count total item
        function (callback) {
            mysqlClient.query({
                sql     : handleSql(sqlWithoutPaging),
                params  : params
            },  function (err, rows) {
                if (err || !rows || rows.length === 0) {
                    return callback(new DBError(), null);
                }

                //setting data set
                result.pagingInfo = {};
                result.pagingInfo.totalNum = rows[0]["totalNum"];

                return callback(null, null);
            });
        }
    ],  function (err, data) {
        if (err) {
            return callback(err, null);
        }

        callback(null, result);
    });
};

/**
 * handle sql (given a common query sql and generated to be `count` sql)
 * @param  {String} querySql the original common query sql
 * @return {String}          a processed count sql
 */
function handleSql (querySql) {
    if (!querySql) {
        return "";
    }

    var countSql = "";
    var fromIndex = querySql.toLowerCase().indexOf(" from");    //the first hitting `from ` index

    countSql = " select count(1) as totalNum " + querySql.substring(fromIndex);
    console.log("the count sql is : " + countSql);

    return countSql;
}

