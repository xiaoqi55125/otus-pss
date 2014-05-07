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
  Desc: the proxy of user
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get user info by user id
 * @param  {string}   userId   user id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getUserById = function (userId, callback) {
    debugProxy("proxy/user/getUserInfoById");

    userId = userId || "";

    if (userId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql : "SELECT * FROM USER_LOGIN WHERE USER_ID = :USER_ID",
        params : {
            "USER_ID"  : userId
        }
    }, function (err, rows) {
        if (err) {
            debugProxy("[getUserById error]: %s", err);
            return callback(new ServerError(), null);
        }

        if (rows && rows.length > 0) {
            return callback(null, rows[0]);
        }
        
        return callback(new DataNotFoundError(), null);
    });
};

/**
 * get all users
 * @param  {Function} callback   the callback func
 * @param  {Object}   pagingInfo page info
 * @return {null}              
 */
exports.getAllUsers = function (callback, pagingInfo) {
    debugProxy("proxy/user/getAllUsers");

    var sql = "";
    var params = {};

    if (pagingInfo) {
        sql                  = "SELECT * FROM USER_LOGIN LIMIT :start, :end ";
        pagingInfo.pageIndex = pagingInfo.pageIndex ? pagingInfo.pageIndex : 1;
        params.start         = (pagingInfo.pageIndex - 1) * config.default_page_size;
        params.end           = config.default_page_size;
    } else {
        sql = "SELECT * FROM USER_LOGIN ";
    }

    mysqlClient.query({
        sql     : sql,
        params  : params
    }, function (err, rows) {
        if (err) {
            debugProxy("[getAllUsers error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * create a new user
 * @param  {Object}   userInfo the creating user info
 * @param  {Function} callback the call back func
 * @return {null}            
 */
exports.createUser = function (userInfo, callback) {
    debugProxy("proxy/user/createUser");

    var sql = "INSERT INTO USER_LOGIN VALUES(:USER_ID, :USER_NAME, :SALT, :PASSWORD, :LAST_LOGIN, :REMARK)";

    mysqlClient.query({
        sql     : sql,
        params  : userInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[createUser error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * modify a user by userId
 * @param  {String}   userId   the user id
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.modifyUser = function (userInfo, callback) {
    debugProxy("proxy/user/modifyUserById");

    var sql = "UPDATE USER_LOGIN SET USER_NAME = :USER_NAME, SALT = :SALT, " +
              " PASSWORD = :PASSWORD, LAST_LOGIN = :LAST_LOGIN, REMARK = :REMARK " +
              " WHERE USER_ID = :USER_ID";

    mysqlClient.query({
        sql     : sql,
        params  : userInfo
    },  function (err, rows) {
        if (err) {
            debugProxy("[modifyUser error]: %s", err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
    });
};

/**
 * set a user's delete remarker to identify a user expired
 * @param {String} userId the user id
 * @param {Function} callback the cb func
 */
exports.setDeleteRemarker = function (userId, callback) {
    debugProxy("proxy/user/setDeleteRemarker");

    var sql = "UPDATE USER_LOGIN SET REMARK = :REMARK WHERE USER_ID = :USER_ID";

    mysqlClient.query({
        sql     : sql,
        params  : {
            USER_ID   : userId,
            REMARK    : 'DELETED'
        }
    },  function (err, rows) {
        if (err) {
            debugProxy("[setDeleteRemarker error] : " + err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });

};