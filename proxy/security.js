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
  Date: Mar 31, 2014
  Time: 9:37 AM
  Desc: the proxy of security
 */

var mysqlClient = require("../lib/mysqlUtil");

/**
 * get permission by user id
 * @param  {String}   userId   the user id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.getPermissionByUserId = function (userId, callback) {
    debugProxy("proxy/security/getPermissionByUserId");

    var sql = "SELECT SGP.PERMISSION_ID FROM otusDB.USER_LOGIN_SECURITY_GROUP USG " +
              "  LEFT JOIN SECURITY_GROUP_PERMISSION SGP ON USG.GROUP_ID = SGP.GROUP_ID " +
              " WHERE USG.USER_LOGIN_ID = :USER_LOGIN_ID ";

    mysqlClient.query({
        sql     : sql,
        params  : {
            USER_LOGIN_ID     : userId
        }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[getPermissionByUserId error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get security group by user id
 * @param  {String}   userId   the user id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.getSecurityGroupByUserId = function (userId, callback) {
    debugProxy("proxy/security/getSecurityGroupByUserId");

    var sql = "SELECT SG.GROUP_ID FROM otusDB.USER_LOGIN_SECURITY_GROUP USG " +
              "  LEFT JOIN SECURITY_GROUP SG ON USG.GROUP_ID = SG.GROUP_ID " +
              " WHERE USG.USER_LOGIN_ID = :USER_LOGIN_ID ";

    mysqlClient.query({
        sql     : sql,
        params  : {
            USER_LOGIN_ID     : userId
        }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[getSecurityGroupByUserId error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * get all security group
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.getAllSecurityGroup = function (callback) {
    debugProxy("proxy/security/getAllSecurityGroup");

    var sql = "SELECT * FROM otusDB.SECURITY_GROUP ";

    mysqlClient.query({
        sql     : sql,
        params  : null
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[getAllSecurityGroup error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, rows);
    });
};

/**
 * create a new user security group
 * @param  {Object}   userSecurityGroupInfo   user security group info
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.createUserSecurityGroup = function (userSecurityGroupInfo, callback) {
    debugProxy("proxy/security/createUserSecurityGroup");

    var sql = " INSERT INTO otusDB.USER_LOGIN_SECURITY_GROUP VALUES(:USER_LOGIN_ID, :GROUP_ID, :REMARK);";

    mysqlClient.query({
        sql     : sql,
        params  : userSecurityGroupInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[createUserSecurityGroup error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * delete a user security group
 * @param  {String}   userId   the user id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.deleteUserSecurityGroup = function (userSecurityGroupInfo, callback) {
    debugProxy("proxy/security/deleteUserSecurityGroup");

    var sql = " DELETE FROM otusDB.USER_LOGIN_SECURITY_GROUP " +
              " WHERE USER_LOGIN_ID = :USER_LOGIN_ID AND GROUP_ID = :GROUP_ID";

    mysqlClient.query({
        sql     : sql,
        params  : userSecurityGroupInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("[deleteUserSecurityGroup error] :%s", err);
            return callback(new DBError(), null);
        }

        return callback(null, null);
    });
};

/**
 * get permission by user id
 * @param  {String}   userId   the user id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
// exports.getPermissionByUserId = function (userId, callback) {
//     debugProxy("proxy/security/getPermissionByUserId");

// };