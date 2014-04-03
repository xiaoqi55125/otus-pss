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
  Desc: the controller of journal
 */

var Journal  = require("../proxy").Journal;
var util     = require("../lib/util");
var config   = require("../appConfig").config;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;

/**
 * find journal - multi query
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findJournal = function (req, res, next) {
    debugCtrller("controller/journal/findJournal");

    var queryConditions       = {};
    queryConditions.jtId      = req.query.jtId || "";
    queryConditions.productId = req.query.productId || "";
    queryConditions.from_dt   = req.query.from_dt || "";
    queryConditions.to_dt     = req.query.to_dt || "";

    try {
        sanitize(sanitize(queryConditions.jtId).trim()).xss();
        sanitize(sanitize(queryConditions.productId).trim()).xss();
        sanitize(sanitize(queryConditions.from_dt).trim()).xss();
        sanitize(sanitize(queryConditions.to_dt).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    if (queryConditions.from_dt) {
        queryConditions.from_dt += " 00:00:00";
    }

    if (queryConditions.to_dt) {
        queryConditions.to_dt += " 23:59:59";
    }

    Journal.getJournalWithQueryConditions(queryConditions, function (err, data) {
         if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });

};