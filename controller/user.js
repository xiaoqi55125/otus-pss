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

/**
 * find all users
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.findAll = function (req, res, next) {
    debugCtrller("controller/user/findAll");
    console.log(config.statusCode.STATUS_OK);

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
    userObj.USER_ID   = util.GUID();
    userObj.USER_NAME = req.body.USER_NAME || "";
    userObj.SEX       = req.body.SEX || "1";
    userObj.REMARK    = req.body.REMARK || "";

    try {
        check(userObj.USER_NAME).notEmpty();
    } catch (e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

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
    userObj.SEX       = req.body.SEX || "1";
    userObj.REMARK    = req.body.REMARK || "";

    try {
        check(userObj.USER_ID).notEmpty();
        check(userObj.USER_NAME).notEmpty();
    } catch(e) {
        return res.send(util.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    User.modifyUser(userObj, function (err, data) {
        if (err) {
            return res.send(util.generateRes(null, err.statusCode));
        }

        return res.send(util.generateRes(null, config.statusCode.STATUS_OK));
    });
};