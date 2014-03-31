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
  Time: 9:36 AM
  Desc: the controller of security
 */

var Security = require("../proxy").Security;
var User     = require("../proxy").User;
var util     = require("../lib/util");
var config   = require("../appConfig").config;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;
var async    = require("async");
var SHA256   = require("crypto-js/sha256");

/**
 * user sign in
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.signIn = function (req, res, next) {
    debugCtrller("controller/user/signIn");

    var userId      = req.body.auth.userId || "";
    var passwd      = req.body.auth.passwd || "";

    try {
        check(userId).notEmpty();
        check(passwd).notEmpty();

        userId      = sanitize(sanitize(userId).trim()).xss();
        passwd      = sanitize(sanitize(passwd).trim()).xss();
    } catch (e) {
        return res.send("5");
    }

    User.getUserById(userId, function (err, userAuthInfo) {
        if (err) {
            return res.send("3");
        }

        if (!userAuthInfo) {
            return res.send("2");
        }

        var encryptPwd = SHA256(passwd + userAuthInfo.SALT).toString();

        //check
        if (userId === userAuthInfo.USER_ID && encryptPwd === userAuthInfo.PASSWORD) {
            var user         = {};
            user.userId      = userId;
            user.uName       = userAuthInfo.USER_NAME; 
            req.session.user = user;

            userAuthInfo.LAST_LOGIN = new Date().Format("yyyy-MM-dd hh:mm:ss");
            User.modifyUser(userAuthInfo, function (err, row) {
                if (err) {
                    debugCtrller("[sign error]: %s", err);
                    return res.send("0");
                }

                debugCtrller("success");
                return res.send("1");
            });

        } else {
            debugCtrller("fail");
            return res.send("0");
        }
    });
};


/**
 * generate random number with bit num [for salt]
 * @param  {Number} bitNum the random number's bit num
 * @return {String}        the string of random number's set
 */
function randomNumberWithBitNum (bitNum) {
    var bn, num = "";
    if (typeof bitNum === undefined) {
        bn = 6;
    } else {
        bn = bitNum;
    }

    for (var i = 0; i < bn; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

/**
 * get permission with user id
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.permissions = function (req, res, next) {
    debugCtrller("controller/security/permissions");

    var userId = req.params.userId || "";

    try {
        check(userId).notEmpty();
        sanitize(sanitize(userId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Security.getPermissionByUserId(userId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, config.err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find all security group
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAllSecurityGroup = function (req, res, next) {
    debugCtrller("controller/security/findAllSecurityGroup");

    Security.getAllSecurityGroup(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, config.err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new user security group
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.addUserSecurityGroup = function (req, res, next) {
    debugCtrller("controller/security/addUserSecurityGroup");

    var userId  = req.body.userId || "";
    var groupId = req.body.groupId || "";
    var remark  = req.body.remark || ""

    try {
        check(userId).notEmpty();
        sanitize(sanitize(userId).trim()).xss();

        check(groupId).notEmpty();
        sanitize(sanitize(groupId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var userSecurityGroupInfo = {
        USER_LOGIN_ID     : userId,
        GROUP_ID          : groupId,
        REMARK            : remark
    };

    Security.createUserSecurityGroup(userSecurityGroupInfo, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, config.err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * delete a user security group
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.deleteUserSecurityGroup = function (req, res, next) {
    debugCtrller("controller/security/deleteUserSecurityGroup");

    var userId  = req.params.userId || "";
    var groupId = req.params.groupId || "";

    try {
        check(userId).notEmpty();
        sanitize(sanitize(userId).trim()).xss();

        check(groupId).notEmpty();
        sanitize(sanitize(groupId).trim()).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var userSecurityGroupInfo = {
        USER_LOGIN_ID    : userId,
        GROUP_ID         : groupId
    };

    Security.deleteUserSecurityGroup(userSecurityGroupInfo, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, config.err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};