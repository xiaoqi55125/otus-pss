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
  Desc: the controller of inventory
 */

var Inventory = require("../proxy").Inventory;
var util      = require("../lib/util");
var config    = require("../appConfig").config;
var check     = require("validator").check;
var sanitize  = require("validator").sanitize;

/**
 * find all inventory list
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/inventory/findAll");

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

    Inventory.getAllInventories(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null. err.statusCode));
        }
         
        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    },  pagingConditions);
};

/**
 * find a product's all inventory
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findProductAllInventory = function (req, res, next) {
    debugCtrller("controller/inventory/findProductAllInventory");

    var productId = req.params.productId;

    try {
        check(productId).notEmpty();
        sanitize(sanitize(productId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Inventory.getProductAllInventory(productId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(err, data));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};


/**
 * find a product's num with product id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findProductNum = function (req, res, next) {
    debugCtrller("controller/inventory/findProductNum");

    var productId = req.params.productId;

    try {
        check(productId).notEmpty();
        sanitize(sanitize(productId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Inventory.getProductNumWithId(productId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(err, data));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find a product's some batchNum's num with product id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findNum = function (req, res, next) {
    debugCtrller("controller/inventory/findNum");

    var productId = req.params.productId;
    var batchNum  = req.params.batchNum;

    try {
        check(productId).notEmpty();
        sanitize(sanitize(productId).trim()).xss();

        check(batchNum).notEmpty();
        sanitize(sanitize(batchNum).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Inventory.getNumWithProductIdAndBatchNum(productId, batchNum, function (err, data) {
        if (err) {
            return res.send(util.generateRes(err, data));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};