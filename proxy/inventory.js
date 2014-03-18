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

/**
 * get all inventory
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getAllInventories = function (callback, pagingInfo) {
    debugProxy("proxy/inventory/getAllInventories");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM INVENTORY I " +
                               "  LEFT JOIN PRODUCT P ON I.PRODUCT_ID = P.PRODUCT_ID " +
                               " LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM INVENTORY I " +
              "  LEFT JOIN PRODUCT P ON I.PRODUCT_ID = P.PRODUCT_ID ";
    }

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
};