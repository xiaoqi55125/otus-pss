var tdCont = {
  cell: function(item) {
    return $("<td style='line-height: 35px;'></td>").html(item);
  },

  row: function(pId) {
    return $("<tr id='"+pId+"'></tr>");
  },
  removeTemp: function(pId) {
    return function() {
      removeTemp(pId);
    }
  },
  stockOutClick:function (oId) {
  	return function	() {
  		stockOutClick(oId);
  	}
  },
  stockOutCheck: function (oId) {
  	return function () {
  		stockOutCheck(oId);
  	}
  }
};
/**
 * get all orders 
 * @return {null} 
 */
function getALLOrders (sDate,eDate) {
	$.ajax({
		url:'/orders?from_dt='+sDate+'&to_dt='+eDate,
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {
				$("#add_listView").html("");
				$("#add_listView2").html("");
				for (var i = 0; i < data.data.length; i++) {
					var oInfo = data.data[i];
					var row = tdCont.row(oInfo.ORDER_ID);
					var customerName = tdCont.cell(oInfo.CUSTOMER_NAME);
					var addTime = tdCont.cell(moment(oInfo.DATETIME).format("YYYY年 M月 D日 , H:mm:ss"));
					var remark = tdCont.cell(oInfo.REMARK);
					row.append(customerName);
					row.append(addTime);
					row.append(remark);
					
					if (oInfo.STOCK_STATUS === 0) {
						var link = tdCont.cell($("<a href='javascript:void(0);'>发货</a>"));
						var status = tdCont.cell("<button type='button' class='btn btn-info'>未出库</button>")
						link.click(tdCont.stockOutClick(oInfo.ORDER_ID));
						row.append(link);
						row.append(status);
						$("#add_listView").append(row);
						
					}else if (oInfo.STOCK_STATUS === 2){
						var link = tdCont.cell($("<a href='javascript:void(0);'>查看</a>"));
						var status = tdCont.cell("<button type='button' class='btn btn-success'>已出库</button>")
						link.click(tdCont.stockOutCheck(oInfo.ORDER_ID));
						row.append(link);
						row.append(status);
						$("#add_listView2").append(row);
						//$("#add_listView_already").append(row);
					}else{
						var link = tdCont.cell($("<a href='javascript:void(0);'>查看</a>"));
						var status = tdCont.cell("<button type='button' class='btn btn-warning'>出库中</button>")
						link.click(tdCont.stockOutCheck(oInfo.ORDER_ID));
						row.append(link);
						row.append(status);
						$("#add_listView").append(row);
						//$("#add_listView_already").append(row);
					}
				};
			}
		}
	})
}

function searchOrdersByDate () {
	getALLOrders($("#sDate").val(),$("#eDate").val());
}

function stockOutClick (oId) {
	getOneOrderByOId(oId);
	//modify stocks code to 1 , ing , when done change to 2 , defult is zero
	modifyStockStatus(oId,1);
	
}
function stockOutCheck (oId) {
	window.open('/orderDetails/'+oId);
}

function getOneOrderByOId(oId) {
	$.ajax({
		url:'/orders/'+oId,
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {
				$("#astStockOut_listView").html("");
				$("#lastStockOutCustName").html(data.data.CUSTOMER_NAME);
				$("#lastStockOutTime").html(moment(data.data.DATETIME).format("YYYY年 M月 D日 , H:mm:ss"));
				$("#lastStockOutRemark").html(data.data.REMARK);
				var tempStr = data.data.ORDER_CONTENT;
				var datas = eval('(' + tempStr + ')');  
				var list = datas.data;
				for (var i = 0; i < list.length; i++) {
					var cellData = list[i];
					var row = tdCont.row(cellData.PRODUCT_ID);
					var cellName = tdCont.cell("<span id='name_"+cellData.PRODUCT_ID +"'>"+cellData.PRODUCT_NAME+"</span>");
					//var cellPRICE = tdCont.cell(cellData.AMOUNT);
					var cellNum = tdCont.cell("<span id='num_"+cellData.PRODUCT_ID+"'>"+cellData.NUM+"</span>");
					//var cellCount = tdCont.cell(cellData.PRODUCT_COUNT);
					var cellRemark = tdCont.cell(cellData.REMARK);
					var cellCheck = tdCont.cell($("<label><input id='cb_"+cellData.PRODUCT_ID+"' type='checkbox' name='checkbox1'> 发货确认</label>"));
					row.append(cellName);
					row.append(cellNum);
					//row.append(cellPRICE);
					//row.append(cellCount);
					row.append(cellRemark);
					row.append(cellCheck);
					$("#astStockOut_listView").append(row);
				}
				$("#lastStockOutBtn").unbind('click').removeAttr('onclick');
			  	$("#lastStockOutBtn").attr("onclick","submitStockOut('"+oId+"')");
			  	$("#productIDCheck").keydown(function(event) {  
			        if (event.keyCode == 13) {  
			            getProductCheck($("#productIDCheck").val()); 
			        }  
			    })  
			  	$('#checkStockOut').modal({
					backdrop: false
				});
				$('#checkStockOut').on('hidden.bs.modal', function (e) {
				  	modifyStockStatus(oId,0);
				})
			}else{
				bootbox.alert("服务器出错!");
			}
		}
	})
}


/**
 * submit stock out
 * @param  {[type]} oId [description]
 * @return {[type]}     [description]
 */
function submitStockOut(oId) {
	//check the box 
	//check the stockStatusCode 0 
	
	if (getStockStatus === 2) {
		bootbox.alert("该订单已经出货,请勿重复操作,请检查时候有其他操作员操作!");
	}else{
		//check all checkboxs have checked already
		if($('input[name="checkbox1"]:checked').length == $('input[name="checkbox1"]').length){
	    	$.ajax({
				url:'/stockouts',
				type:'POST',
				data:{'orderId':oId},
				success:function (data) {
					if (data.statusCode === 0) {
						bootbox.alert("该订单出库成功",function () {
							$('#checkStockOut').modal('hide');
							$('#checkStockOut').on('hidden.bs.modal', function (e) {
						  		modifyStockStatus(oId,2);

							});
							
						});
						
					};
				}
			})
		}else{
			bootbox.alert("出库检查未通过,请检查后重试!");
		}
	}
	
	
}


function getProductCheck (pId) {
	 if ( $("#"+pId).length>0 ) {
	 	$.ajax({
	 		url:"/inventories/"+pId,
	 		type:"GET",
	 		success:function (data) {
	 			if (data.statusCode === 0) {
	 				$("#pro_listView").html("");
	 				$("#lastProductName").html($("#name_"+pId).html());
	 				$("#lastProductNum").html($("#num_"+pId).html())
	 				
	 				
	 			}else{
	 				bootbox.alert("未查询到相关数据,请检查库存!");
	 			}
	 		}
	 	})
	 	$('#checkProductBatch').modal({
			backdrop: false
		});

	 	//$("#cb_"+pId).prop("checked", "checked");
	 }else{
	 	bootbox.alert("商品不在列表内!");
	 	return;
	 }
}
/**
 * modify stock status code 
 * @param  {string } orderId 
 * @param  {string } stId    
 * @return {null}
 */
function modifyStockStatus (orderId,stId) {
	$.ajax({
		url:'/orders/'+orderId+'/stockstatus',
		type:'PUT',
		data:{'STOCK_STATUS':stId},
		success:function (data) {
			if (data.statusCode === 0) {
				getALLOrders ('','');
			}else{
				bootbox.alert("修改订单状态失败!");
			}
		}
	})
}

function getStockStatus (orderId) {
	$.ajax({
		url:'/orders/'+orderId+'/stockstatus',
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {
				alert(data.data);
			}
		}
	})
}



