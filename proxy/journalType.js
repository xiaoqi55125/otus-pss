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
  Desc: the proxy of journal type
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get all journal type
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getAllJournalTypes = function (callback, pagingInfo) {
    debugProxy("proxy/journalType/getAllJournalTypes");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM JOURNAL_TYPE " +
                               " LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM JOURNAL_TYPE ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getAllJournalTypes error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * create a new journal type
 * @param  {Object}   journalTypeInfo   the creating journal type info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.createJournalType = function (journalTypeInfo, callback) {
    debugProxy("proxy/journalType/createJournalType");

    var sql = "INSERT INTO JOURNAL_TYPE VALUES(:JT_ID, :JT_NAME, :REMARK)";

    mysqlClient.query({
        sql     : sql,
        params  : journalTypeInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[createJournalType error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * modify a journal type
 * @param  {Object}   journalTypeInfo   the modifying journal type info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.modifyJournalType = function (journalTypeInfo, callback) {
    debugProxy("proxy/journalType/modifyJournalType");

    var sql = "UPDATE JOURNAL_TYPE SET  JT_NAME = :JT_NAME, " +
              "                         REMARK = :REMARK " +
              " WHERE JT_ID = :JT_ID";

    mysqlClient.query({
        sql     : sql,
        params  : journalTypeInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[modifyJournalType error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};