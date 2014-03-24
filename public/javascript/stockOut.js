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
function getALLOrders () {
	$.ajax({
		url:'/orders',
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {
				$("#add_listView").html("");
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
						
					}else if (oInfo.STOCK_STATUS === 1){
						var link = tdCont.cell($("<a href='javascript:void(0);'>查看</a>"));
						var status = tdCont.cell("<button type='button' class='btn btn-success'>已出库</button>")
						link.click(tdCont.stockOutCheck(oInfo.ORDER_ID));
						row.append(link);
						row.append(status);
						//$("#add_listView_already").append(row);
					}else{
						var link = tdCont.cell($("<a href='javascript:void(0);'>查看</a>"));
						var status = tdCont.cell("<button type='button' class='btn btn-warning'>出库中</button>")
						link.click(tdCont.stockOutCheck(oInfo.ORDER_ID));
						row.append(link);
						row.append(status);
						//$("#add_listView_already").append(row);
					}
					$("#add_listView").append(row);
				};
			}
		}
	})
}
function stockOutClick (oId) {
	getOneOrderByOId(oId);
	//modify stocks code to 2 , ing , when done change to 1 , defult is zero
	modifyStockStatus(oId,2);
	
}
function stockOutCheck (oId) {
	window.open('/orderDetails');
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
					var cellName = tdCont.cell(cellData.PRODUCT_NAME);
					//var cellPRICE = tdCont.cell(cellData.AMOUNT);
					var cellNum = tdCont.cell(cellData.NUM);
					var cellCount = tdCont.cell(cellData.PRODUCT_COUNT);
					var cellRemark = tdCont.cell(cellData.REMARK);
					var cellCheck = tdCont.cell($("<label><input id='cb_"+cellData.PRODUCT_ID+"' type='checkbox' name='checkbox1'> 发货确认</label>"));
					row.append(cellName);
					row.append(cellNum);
					//row.append(cellPRICE);
					row.append(cellCount);
					row.append(cellRemark);
					row.append(cellCheck);
					$("#astStockOut_listView").append(row);
				}
				$("#lastStockOutBtn").unbind('click').removeAttr('onclick');
			  	$("#lastStockOutBtn").attr("onclick","submitStockOut('"+oId+"')");
			  	$('#checkStockOut').modal({
					backdrop: false
				});
			}else{
				bootbox.alert("服务器出错!");
			}
		}
	})
}

function submitStockOut(oId) {
	//check the box 
	//check the stockStatusCode 0 

	$.ajax({
		url:'/stockouts',
		type:'POST',
		data:{'orderId':oId},
		success:function (data) {
			if (data.statusCode === 0) {
				bootbox.alert("该订单出库成功");
			};
		}
	})
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
		type:'POST',
		data:{'STOCK_STATUS':stId},
		success:function (data) {
			if (data.statusCode === 0) {

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



