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
  Date: Mar 24, 2014
  Time: 10:19 AM
  Desc: the schedule job
 */

var cronJob     = require('cron').CronJob;
var xlsx        = require("node-xlsx");
var mailService = require("./mail");
var Limitation  = require("../proxy").Limitation;
var appConfig   = require("../appConfig").config;

/**
 * cron job generator
 * @param  {String}   cronPattern the pattern of the cron
 * @param  {Function} doSomething the job func
 * @return {Object}             the real cron job obj
 */
function cronGenerator (cronPattern, doSomething) {
    var cp = cronPattern || "00 00 10 * * 1-5";
    var job = new cronJob({
        cronTime: cp,
        onTick: doSomething,
        start: false,
    });

    return job;
}

/**
 * start e-mail notification for product limitation
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.startLimatationMailNotification = function (cronPattern, callback) {
    debugService("service/cron/startLimatationMailNotification");
    var cp = cronPattern || "00 00 10 * * 1-5";

    var job = cronGenerator(cp, function() {
        generateProductLimitationExcel(function (buffer) {
            mailService.sendMail({
                subject : "Product limitation notification",
                attachments : [
                    {
                        fileName: "ProductLimitationNotification.xlsx",
                        contents: buffer
                    }
                ]
            });
        });
    });

    job.start();
};

/**
 * generate product limitation excel
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function generateProductLimitationExcel (callback) {
    debugService("service/cron/generateProductLimitationExcel");

    Limitation.getUnderLimatationProducts(function (err, items) {
        if (err) {
            return ;
        }

        if (items) {
            debugService("items count: %s", items.length);
            var schema = {
                              worksheets: [
                                  {
                                      "name" : "产品剩余数量提醒",
                                      "data" : [
                                         ["商品名称", "价格", "剩余库存数量", "警戒线"]
                                      ]
                                  }
                              ]
                        };

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var arr = [];
                arr.push(item.PRODUCT_NAME);
                arr.push(item.PRICE);
                arr.push(item.NUM);
                arr.push(item.LIMIT_NUM);
                schema.worksheets[0].data.push(arr);
            }

            var buffer = xlsx.build(schema);

            callback(buffer);
        }
    });
}

