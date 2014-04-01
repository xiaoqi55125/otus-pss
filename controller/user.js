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
  Desc: the controller of user
 */

var User     = require("../proxy").User;
var util     = require("../lib/util");
var config   = require("../appConfig").config;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;
var SHA256       = require("crypto-js/sha256");

/**
 * find all users
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/user/findAll");

    User.getAllUsers(function (err, data) {
        if (err) {
            return res.send(util.generateRes(null. err.statusCode));
        }
         
        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * find a user by userId
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findOne = function (req, res, next) {
    debugCtrller("controller/user/findOne");

    var userId = req.params.userId || "";

    try {
        check(userId).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    User.getUserById(userId, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(data, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new user
 * @param {Object}   req  the instance of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.add = function (req, res, next) {
    debugCtrller("controller/user/add");

    var userObj = {};
    userObj.USER_ID   = req.body.USER_ID || "";
    userObj.USER_NAME = req.body.USER_NAME || "";
    userObj.PASSWORD  = req.body.PASSWORD || "1";
    userObj.REMARK    = req.body.REMARK || "";

    try {
        check(userObj.USER_ID).notEmpty();
        check(userObj.USER_NAME).notEmpty();
        check(userObj.PASSWORD).notEmpty();

        sanitize(sanitize(userObj.USER_ID).trim).xss();
        sanitize(sanitize(userObj.USER_NAME).trim).xss();
        sanitize(sanitize(userObj.PASSWORD).trim).xss();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    userObj.SALT       = randomNumberWithBitNum(6);
    userObj.PASSWORD   = SHA256(userObj.PASSWORD + userObj.SALT).toString();
    userObj.LAST_LOGIN = new Date().Format("yyyy-MM-dd hh:mm:ss");

    User.createUser(userObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a user
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modify = function (req, res, next) {
    debugCtrller("controller/user/modify");

    var userObj = {};
    userObj.USER_ID   = req.params.userId;
    userObj.USER_NAME = req.body.USER_NAME || "";
    userObj.PASSWORD  = req.body.PASSWORD || "";
    userObj.REMARK    = req.body.REMARK || "";

    try {
        check(userObj.USER_ID).notEmpty();
        check(userObj.USER_NAME).notEmpty();
        check(userObj.PASSWORD).notEmpty();

        sanitize(sanitize(userObj.USER_ID).trim).xss();
        sanitize(sanitize(userObj.USER_NAME).trim).xss();
        sanitize(sanitize(userObj.PASSWORD).trim).xss();
    } catch(e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    userObj.SALT       = randomNumberWithBitNum(6);
    userObj.PASSWORD   = SHA256(userObj.PASSWORD + userObj.SALT).toString();
    userObj.LAST_LOGIN = new Date().Format("yyyy-MM-dd hh:mm:ss");

    User.modifyUser(userObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
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

