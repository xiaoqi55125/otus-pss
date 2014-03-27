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
  Desc: the controller of stock in
 */

var StockIn    = require("../proxy").StockIn;
var PreStockIn = require("../proxy").PreStockIn;
var util       = require("../lib/util");
var config     = require("../appConfig").config;
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var async      = require("async");
require("../lib/DateUtil");

/**
 * add a new stockIn
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.stockIn = function (req, res, next) {
    debugCtrller("controller/stockIn/stockIn");

    var psiId = req.params.psiId;

    try {
        check(psiId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    async.waterfall([

        //step 1: get pre stock in info
        function (callback) {
            PreStockIn.getPreStockInById(psiId, function (err, data) {

                if (data) {
                    var stockInInfo     = {};
                    var productsJSonStr = data["PSI_CONTENT"];

                    var productsJsonObj = JSON.parse(productsJSonStr);
                    var serial_num      = util.GUID();
                    
                    var warppedObjArr = productsJsonObj.data.map(function (item) {
                        item.SERIAL_NUM = serial_num;
                        item.SI_ID      = util.GUID();
                        item.SI_DATE    = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        return item;
                    });

                    stockInInfo.productList = warppedObjArr;
                    return callback(err, stockInInfo);
                };
                

                return callback(err, data);
            });
        },
        //step 2:do stock in
        function (stockInInfo, callback) {
            StockIn.doStockIn(stockInInfo, function (err, data) {
                callback(err, stockInInfo);
            });
        },
        //step 3:delete pre-stock in item
        function (stockInInfo, callback) {
            PreStockIn.delete(psiId, function (err, data) {
                callback(err, stockInInfo);
            });
        },
        //step 4:write journal
        function (stockInInfo, callback) {
            StockIn.writeStockInJournal(JSON.stringify(stockInInfo.productList), function (err, data) {
                callback(err);
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
 * modify a stockIn
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modify = function (req, res, next) {
    debugCtrller("controller/stockIn/modify");

};