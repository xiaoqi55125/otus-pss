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

/**
 * multi query for journal
 * @param  {Object}   queryConditions   the query conditions
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getJournalWithQueryConditions = function (queryConditions, callback) {
    debugProxy("proxy/journal/createJournal");

    var sql = 'SELECT * FROM JOURNAL WHERE 1 = 1 ';

    if (queryConditions) {
        if (queryConditions.jtId) {
            sql += (' AND JT_ID = "' + queryConditions.jtId + '" ');
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

    mysqlClient.query({
        sql     : sql,
        params  : queryConditions
    },  function (err, rows) {
        if (err) {
            debugProxy("[createJournal error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

