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
  Time: 1:47 PM
  Desc: the controller of pre stock in
 */

var PreStockIn = require("../proxy").PreStockIn;
var util       = require("../lib/util");
var config     = require("../appConfig").config;
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var async      = require("async");
require("../lib/DateUtil");

/**
 * find all pre stock in items
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/preStockIn/findAll");

    var pagingConditions      = req.query.pageIndex ? {} : null;
    if (pagingConditions) {
        pagingConditions.pageIndex = parseInt(req.query.pageIndex);
        pagingConditions.pageSize = req.query.pageSize || config.default_page_size;

        try {
            sanitize(sanitize(pagingConditions.pageIndex).trim()).xss();
            sanitize(sanitize(pagingConditions.pageSize).trim()).xss();
        } catch (e) {
            return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
        }
    }

    PreStockIn.getAllPreStockIns(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null. err.statusCode));
        }
         
        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    },  pagingConditions);
};

/**
 * find a pre stock in by id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findOne = function (req, res, next) {
    debugCtrller("controller/preStockIn/findOne");

    var psiId = req.params.psiId || "";

    try {
        check(psiId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    PreStockIn.getPreStockInById(psiId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * do pre stock in
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.preStockIn = function (req, res, next) {
    debugCtrller("controller/preStockIn/preStockIn");

    var productsJSonStr = req.body.jsonStr || "";
    var psiId = util.GUID();

    try {
        check(productsJSonStr).notEmpty();
        sanitize(sanitize(productsJSonStr).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var preStockInInfo = {
        PSI_CONTENT     : productsJSonStr,
        PSI_ID          : psiId,
        PSI_TIME        : new Date().Format("yyyy-MM-dd hh:mm:ss"),
        OPERATOR        : req.session.user.userId,
        REMARK          : ""
    };

    async.series([
        //step 1:
        function (callback) {
            PreStockIn.create(preStockInInfo, function (err, data) {
                callback(err, null);
            });
        },
        function (callback) {
            PreStockIn.writePreStockInJournal({
                journalContent  : productsJSonStr,
                operator        : req.session.user.userId
            }, function (err, data) {
                callback(err, null);
            });
        }
    ],  function (err, values) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });

};

/**
 * delete a pre stock in item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.delete = function (req, res, next) {
    debugCtrller("controller/preStockIn/delete");

    var psiId = rq.params.psiId;

    try {
        check(psiId).notEmpty();
        sanitize(sanitize(psiId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    PreStockIn.delete(psiId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    })
};