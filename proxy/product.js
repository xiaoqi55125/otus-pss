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
  Desc: the proxy of product
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get all product list
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getAllProducts = function (callback, pagingInfo) {
    debugProxy("proxy/product/getAllProducts");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM PRODUCT P " +
                               "  LEFT JOIN PRODUCT_CATEGORY PC ON P.PC_ID = PC.PC_ID " +
                               " LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM PRODUCT P " +
              "  LEFT JOIN PRODUCT_CATEGORY PC ON P.PC_ID = PC.PC_ID ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getAllProducts error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get product by id
 * @param  {string}   productId   the product id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getProductById = function (productId, callback) {
    debugProxy("proxy/product/getProductById");

    productId = productId || "";

    if (productId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT * FROM PRODUCT P " +
              "  LEFT JOIN PRODUCT_CATEGORY PC ON P.PC_ID = PC.PC_ID " +
              " WHERE PRODUCT_ID = :PRODUCT_ID",
        params : {
            "PRODUCT_ID"  : productId
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getProductById error]: %s", err);
            return callback(new ServerError(), null);
        }

        if (rows && rows.length > 0) {
            return callback(null, rows[0]);
        } else {
            return callback(new DataNotFoundError(), null);
        }
    });
};

/**
 * create a new product
 * @param  {Object}   productInfo   the creating product info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.createProduct = function (productInfo, callback) {
    debugProxy("proxy/product/createProduct");

    var sql = "INSERT INTO PRODUCT( PRODUCT_ID, " +
              "                     PRODUCT_NAME, " +
              "                     PRICE, " +
              "                     MANUFACTURE_NAME, " +
              "                     MANUFACTURE_DATE, " +
              "                     PC_ID) " +
              "VALUES(:PRODUCT_ID, :PRODUCT_NAME, :PRICE, :MANUFACTURE_NAME, :MANUFACTURE_DATE, :PC_ID)";

    mysqlClient.query({
        sql     : sql,
        params  : productInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[createProduct error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * modify a product
 * @param  {Object}   productInfo   the modifying product info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.modifyProduct = function (productInfo, callback) {
    debugProxy("proxy/product/modifyProduct");

    var sql = "UPDATE PRODUCT SET PRODUCT_NAME = :PRODUCT_NAME, " +
              "                   PRICE = :PRICE, " +
              "                   MANUFACTURE_NAME = :MANUFACTURE_NAME, " +
              "                   MANUFACTURE_DATE = :MANUFACTURE_DATE, " +
              "                   PC_ID = :PC_ID " +
              " WHERE PRODUCT_ID = :PRODUCT_ID";

    mysqlClient.query({
        sql     : sql,
        params  : productInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[modifyProduct error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};