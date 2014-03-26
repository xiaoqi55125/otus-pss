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
  Date: Mar 24, 2014
  Time: 10:25 AM
  Desc: the proxy of limitation
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get products that under limatation line
 * @param  {Function} callback the cb 
 * @return {null}     
 */
exports.getUnderLimatationProducts = function (callback) {
    debugProxy("proxy/limitation/getUnderLimatationProducts");

    var sql = "SELECT p.PRODUCT_NAME, p.PRICE, SUM(i.NUM) AS NUM, p.LIMIT_NUM FROM INVENTORY i " +
              "  LEFT JOIN PRODUCT p ON p.PRODUCT_ID = i.PRODUCT_ID " +
              " WHERE i.NUM <= p.LIMIT_NUM GROUP BY i.PRODUCT_ID";

    mysqlClient.query({
        sql     : sql,
        params  : null
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[getUnderLimatationProducts error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows);
    });
};

