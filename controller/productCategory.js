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
  Desc: the controller of product category
 */

var ProductCategory = require("../proxy").ProductCategory;
var util          = require("../lib/util");
var config        = require("../appConfig").config;
var check         = require("validator").check;
var sanitize      = require("validator").sanitize;

/**
 * find all product category
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/productCategory/findAll");

    ProductCategory.getAllProductCategories(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null. err.statusCode));
        }
         
        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find a product Category by id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findOne = function (req, res, next) {
    debugCtrller("controller/productCategory/findAll");

    var pcId = req.params.pcId || "";

    try {
        check(pcId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    ProductCategory.getProductCategoryById(pcId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find products under current product category
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findProducts = function (req, res, next) {
    debugCtrller("controller/productCategory/findProducts");

    var pcId = req.params.pcId || "";

    try {
        check(pcId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    ProductCategory.getProductsByPCId(pcId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
}

/**
 * add a new product Category
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.add = function (req, res, next) {
    debugCtrller("controller/productCategory/add");

    var pcObj     = {};
    pcObj.PC_ID   = util.GUID();
    pcObj.PC_NAME = req.body.PC_NAME || "";
    pcObj.REMARK  = req.body.REMARK || "";

    try {
        check(pcObj.PC_NAME).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    ProductCategory.createProductCategory(pcObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a product Category
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modify = function (req, res, next) {
    debugCtrller("controller/productCategory/modify");

    var pcObj     = {};
    pcObj.PC_ID   = req.params.pcId;
    pcObj.PC_NAME = req.body.PC_NAME || "";
    pcObj.REMARK  = req.body.REMARK || "";

    try {
        check(pcObj.PC_ID).notEmpty();
        check(pcObj.PC_NAME).notEmpty();
    } catch(e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    ProductCategory.modifyProductCategory(pcObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};

