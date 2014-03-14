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
  Desc: the proxy of product category
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get all product category list
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getAllProductCategories = function (callback, pagingInfo) {
    debugProxy("proxy/productCategory/getAllProductCategories");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM PRODUCT_CATEGORY LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = " SELECT * FROM PRODUCT_CATEGORY ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getAllProductCategories error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get product category by id
 * @param  {string}   pcId   the product category id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getProductCategoryById = function (pcId, callback) {
    debugProxy("proxy/productCategory/getProductCategoryById");

    pcId = pcId || "";

    if (pcId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT * FROM PRODUCT_CATEGORY WHERE PC_ID = :PC_ID",
        params : {
            "PC_ID"  : pcId
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getProductCategoryById error]: %s", err);
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
 * get products under current product category id
 * @param  {String}   pcId       the product category's id
 * @param  {Function} callback   the cb func
 * @param  {Object}   pagingInfo the paging info
 * @return {null}              
 */
exports.getProductsByPCId = function (pcId, callback, pagingInfo) {
    debugProxy("proxy/productCategory/getProductsByPCId");

    var sql = "";
    var params = {};
    params.PC_ID = pcId;

    if (pagingInfo) {
        sql                  = "SELECT * FROM PRODUCT WHERE PC_ID = :PC_ID LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = " SELECT * FROM PRODUCT_CATEGORY WHERE PC_ID = :PC_ID ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getProductsByPCId error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * create a new product category
 * @param  {Object}   pcInfo   the creating product category info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.createProductCategory = function (pcInfo, callback) {
    debugProxy("proxy/productCategory/createProductCategory");

    var sql = "INSERT INTO PRODUCT_CATEGORY VALUES(:PC_ID, :PC_NAME, :REMARK)";

    mysqlClient.query({
        sql     : sql,
        params  : pcInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[createProductCategory error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * modify a product category
 * @param  {Object}   pcInfo   the modifying product category info
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.modifyProductCategory = function (pcInfo, callback) {
    debugProxy("proxy/productCategory/modifyProductCategory");

    var sql = "UPDATE PRODUCT_CATEGORY SET PC_NAME = :PC_NAME, REMARK = :REMARK " +
              " WHERE PC_ID = :PC_ID";

    mysqlClient.query({
        sql     : sql,
        params  : pcInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[modifyProductCategory error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

