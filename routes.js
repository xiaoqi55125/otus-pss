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
  Time: 12:00 AM
  Desc: the url router's definition
 */

var journalCtrller         = require("./controller/journal");
var journalTypeCtrller     = require("./controller/journalType");
var productCtrller         = require("./controller/product");
var productCategoryCtrller = require("./controller/productCategory");
var stockInCtrller         = require("./controller/stockIn");
var stockOutCtrller        = require("./controller/stockOut");
var userCtrller            = require("./controller/user");
var inventoryCtrller       = require("./controller/inventory");
var orderCtrller           = require("./controller/order");
var pssRender              = require('./controller/render');
var preStockInCtrller      = require("./controller/preStockIn");
var securityCtrller        = require("./controller/security");

module.exports = function (app) {

    /************************************************************************/
    /*                Resful: URI Represent a Resource!!!                   */
    /************************************************************************/

    /**
     * ----------------------------------- page ----------------------------- *
     */
    app.get("/",pssRender.index);
    app.get("/login",pssRender.showLogin);
    app.get("/stockOut",pssRender.stockOut);
    app.get("/order",pssRender.order);
    app.get("/stockIn",pssRender.stockIn);
    app.get("/pStockIn",pssRender.pStockIn);
    app.get("/pro_cate",pssRender.pro_cate);
    app.get("/product",pssRender.products);
    app.get("/orderDetails/:orderId",pssRender.orderDetails);
    app.get("/journal",pssRender.journal);
    app.get("/inventory",pssRender.inventory);
    app.get("/group",pssRender.group);
    app.get("/editPwd",pssRender.editPwd);
    app.get("/addUser",pssRender.addUser);

    
    
    /**
     * ----------------------------------- api ----------------------------- *
     */
    
    //user
    app.get("/users", userCtrller.findAll);
    // app.get("/users/:userId", userCtrller.findOne);
    app.post("/users", userCtrller.add);
    app.put("/users/:userId", userCtrller.modify);
    app.delete("/user/:userId", userCtrller.delete);

    //product
    app.get("/products", productCtrller.findAll);
    app.get("/products/:productId", productCtrller.findOne);
    // app.get("/products/:productId/inventory", productCtrller.findInventory);
    app.post("/products", productCtrller.add);
    app.put("/products/:productId", productCtrller.modify);
    // app.delete("/products/:userId", productCtrller.delete);
    app.get("/product/productIds/:partialId", productCtrller.getProductIds);

    //product category
    app.get("/productcategories", productCategoryCtrller.findAll);
    app.get("/productcategories/:pcId/products", productCategoryCtrller.findProducts);
    app.get("/productcategories/:pcId", productCategoryCtrller.findOne);
    app.post("/productcategories", productCategoryCtrller.add);
    app.put("/productcategories/:pcId", productCategoryCtrller.modify);
    // app.delete("/productcategories/:pcId", productCategoryCtrller.delete);
    // 
    
    //pre stock in
    app.get("/prestockins", preStockInCtrller.findAll);
    app.get("/prestockins/:psiId", preStockInCtrller.findOne);
    app.post("/prestockins", preStockInCtrller.preStockIn);
    app.delete("/prestockins/:psiId", preStockInCtrller.delete);

    // //stock in
    // app.get("/stockins", stockInCtrller.findAll);         //distinct serial number
    // app.get("/stockins/:sn", stockInCtrller.findOne);     //find by serial number
    app.post("/stockins/:psiId", stockInCtrller.stockIn);           // make sure
    // app.delete("/stockins/:sn", stockInCtrller.delete);
    app.get("/stockins/suppliers", stockInCtrller.findAllSuppliers);

    // //stock out
    // app.get("/stockouts", stockOutCtrller.findAll);
    app.get("/stockouts/:orderId", stockOutCtrller.findByOrder);
    app.post("/stockouts", stockOutCtrller.stockOut);
    // app.delete("/stockouts", stockOutCtrller.delete);

    //inventory
    app.get("/inventories", inventoryCtrller.findAll);
    app.get("/inventories/:productId", inventoryCtrller.findProductAllInventory);
    app.get("/inventories/:productId/num", inventoryCtrller.findProductNum);
    app.get("/inventories/:productId/:batchNum/num", inventoryCtrller.findNum);

    //order
    //params: from_dt=:from_dt&to_dt=:to_dt&status=0/1/2
    app.get("/orders", orderCtrller.findAll);
    app.get("/orders/:orderId", orderCtrller.findOne);
    app.post("/orders", orderCtrller.add);
    app.put("/orders", orderCtrller.modify);
    app.get("/orders/:orderId/stockstatus", orderCtrller.findStockStatus);
    app.put("/orders/:orderId/stockstatus", orderCtrller.modifyStockStatus);
    app.get("/orders/all/customers", orderCtrller.findAllCustomers);
    app.delete("/orders/:orderId", orderCtrller.delete);

    //journal type
    app.get("/journaltypes", journalTypeCtrller.findAll);
    // app.get("/journaltypes/:jtId/journals", journalTypeCtrller.findJournal);
    app.post("/journaltypes", journalTypeCtrller.add);
    app.put("/journaltypes/:jtId", journalTypeCtrller.modify);

    //journal  
    //params : jtId=:jtId&productId=:productId&from_dt=:from_dt&to_dt=:to_dt
    app.get("/journals", journalCtrller.findJournal);
    app.get("/stockjournals", journalCtrller.findStockJournal);
    app.get("/stockjournals/:relatedId/records", journalCtrller.findStockJournalWithRelatedId);
    app.get("/stockjournals/statistics", journalCtrller.statistics);

    //security
    app.post("/signin", securityCtrller.signIn);
    app.get("/signout", securityCtrller.signOut);
    app.get("/users/:userId/securitygroups", securityCtrller.findUserSecurityGroup);
    app.get("/users/:userId/permissions", securityCtrller.permissions);
    app.get("/securitygroups", securityCtrller.findAllSecurityGroup);
    app.post("/usersecuritygroups", securityCtrller.addUserSecurityGroup);    
    app.delete("/usersecuritygroups/:userId/:groupId", securityCtrller.deleteUserSecurityGroup);

}

