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
  Desc: the controller of product
 */

var Product  = require("../proxy").Product;
var util     = require("../lib/util");
var config   = require("../appConfig").config;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;

/**
 * find all products
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/product/findAll");

    Product.getAllProducts(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null. err.statusCode));
        }
         
        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find a product by id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findOne = function (req, res, next) {
    debugCtrller("controller/product/findOne");

    var productId = req.params.productId || "";

    try {
        check(productId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Product.getProductById(productId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new product
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.add = function (req, res, next) {
    debugCtrller("controller/product/add");

    var productObj              = {};
    productObj.PRODUCT_ID       = req.body.PRODUCT_ID || "";
    productObj.PRODUCT_NAME     = req.body.PRODUCT_NAME || "";
    productObj.PRICE            = req.body.PRICE || "";
    productObj.MANUFACTURE_NAME = req.body.MANUFACTURE_NAME || "";
    productObj.MANUFACTURE_DATE = req.body.MANUFACTURE_DATE || "";
    productObj.PC_ID            = req.body.PC_ID || "";

    try {
        check(productObj.PRODUCT_NAME).notEmpty();
        check(productObj.PRICE).notEmpty();
        check(productObj.PC_ID).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Product.createProduct(productObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a product
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modify = function (req, res, next) {
    debugCtrller("controller/product/modify");

    var productObj              = {};
    productObj.PRODUCT_ID       = req.params.productId;
    productObj.PRODUCT_NAME     = req.body.PRODUCT_NAME || "";
    productObj.PRICE            = req.body.PRICE || "";
    productObj.MANUFACTURE_NAME = req.body.MANUFACTURE_NAME || "";
    productObj.MANUFACTURE_DATE = req.body.MANUFACTURE_DATE || "";
    productObj.PC_ID            = req.body.PC_ID || "";
    productObj.LIMIT_NUM        = req.body.LIMIT_NUM || 0;

    try {
        check(productObj.PRODUCT_ID).notEmpty();
        check(productObj.PRODUCT_NAME).notEmpty();
        check(productObj.PRICE).notEmpty();
        check(productObj.PC_ID).notEmpty();
    } catch(e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Product.modifyProduct(productObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};

