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
  Desc: the controller of journal type
 */

var JournalType = require("../proxy").JournalType;
var util        = require("../lib/util");
var config      = require("../appConfig").config;
var check       = require("validator").check;
var sanitize    = require("validator").sanitize;

/**
 * find all journal types
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/journalType/findAll");

    JournalType.getAllJournalTypes(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null. err.statusCode));
        }
         
        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new journalType
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.add = function (req, res, next) {
    debugCtrller("controller/journalType/add");

    var jtObj     = {};
    jtObj.JT_ID   = util.GUID();
    jtObj.JT_NAME = req.body.JT_NAME || "";
    jtObj.REMARK  = req.body.REMARK || "";

    try {
        check(jtObj.JT_NAME).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    JournalType.createJournalType(jtObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a journalType
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modify = function (req, res, next) {
    debugCtrller("controller/journalType/modify");

    var jtObj     = {};
    jtObj.JT_ID   = req.params.jtId;
    jtObj.JT_NAME = req.body.JT_NAME || "";
    jtObj.REMARK  = req.body.REMARK || "";

    try {
        check(jtObj.JT_ID).notEmpty();
        check(jtObj.JT_NAME).notEmpty();
    } catch(e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    JournalType.modifyJournalType(jtObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};