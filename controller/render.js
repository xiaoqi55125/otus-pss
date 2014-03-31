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
  Date: Jan 13, 2014
  Time: 3:55 PM
  Desc: the controller for render page
  */

/**
 * 404 error controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
 exports.fourofour=function (req, res, next){
  debugCtrller("/controller/render/fourofour");
  res.render('error/404');
};

/**
 * index page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.index = function (req, res, next) {
  debugCtrller("/controller/render/index");
  res.render('subview/stockIn');
}
/**
 * show login page
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.showLogin = function (req, res, next) {
    debugCtrller("controllers/login/showLogin");
    res.render("login");
};
/**
 * pStockIn page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.pStockIn = function (req, res, next) {
  debugCtrller("/controller/render/pStockIn");
  res.render('subview/pStockIn');
}

/**
 * pro_cate page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.pro_cate = function (req, res, next) {
  debugCtrller("/controller/render/pro_cate");
  res.render('subview/pro_cate');
}

/**
 * stockOut page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.stockOut = function (req, res, next) {
  debugCtrller("/controller/render/stockOut");
  res.render('subview/stockOut');
}

/**
 * inventories page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.inventory = function (req, res, next) {
  debugCtrller("/controller/render/inventories");
  res.render('subview/inventories');
}


/**
 * order page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.order = function (req, res, next) {
  debugCtrller("/controller/render/order");
  res.render('subview/order');
}

/**
 * orderDetails page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.orderDetails = function (req, res, next) {
  debugCtrller("/controller/render/orderDetails");
  var orderId = req.params.orderId || "";
  res.render('subview/orderDetails', {layout: false,orderId:orderId});
}


/**
 * stockIn page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.stockIn = function (req, res, next) {
  debugCtrller("/controller/render/stockIn");
  res.render('subview/stockIn');
}

/**
 * products page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.products = function (req, res, next) {
  debugCtrller("/controller/render/products");
  res.render('subview/products');
}

/**
 * journal page controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.journal = function (req, res, next) {
  debugCtrller("/controller/render/journal");
  res.render('subview/journal');
}

