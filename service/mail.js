/*
  #!/usr/local/bin/node
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
  Date: Jan 10, 2014
  Time: 4:22 PM
  Desc: the mail service
 */

var mailer    = require("nodemailer");
var appConfig = require("../appConfig").config;

var transport = mailer.createTransport("SMTP", appConfig.mail_opts);

/**
 * send mail
 * @param  {object} mailObj the instance of mail
 * mail object like :
 * {
 *   from : xxx
 *   to   : xxx
 *   subject : xxx
 *   text/html : xxx
 * }
 * @return {null}         
 */
exports.sendMail = function (mailObj) {
    debugService("/services/mail/sendMail");
    if (!mailObj.hasOwnProperty("from")) {
        mailObj.from = appConfig.mail_opts.auth.user;
    }

    //if there is no property then use default
    if (!mailObj.hasOwnProperty("to")) {
        mailObj.to = appConfig.mailDefault_TO.join(",");
    }

    debugService("sending mail .....");

    transport.sendMail(mailObj, function (err) {
        if (err) {
            console.log("mail error:");
            console.log(err);
        }
    });
};