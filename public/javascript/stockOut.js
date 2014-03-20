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
					
					if (oInfo.IS_STOCKOUT === 0) {
						var link = tdCont.cell($("<a href='javascript:void(0);'>发货</a>"));
						link.click(tdCont.stockOutClick(oInfo.ORDER_ID));
						row.append(link);
						$("#add_listView").append(row);
					}else{
						var link = tdCont.cell($("<a href='javascript:void(0);'>查看</a>"));
						link.click(tdCont.stockOutCheck(oInfo.ORDER_ID));
						row.append(link);
						$("#add_listView_already").append(row);
					}
				};
			}
		}
	})
}
function stockOutClick (oId) {
	alert("stockOutClick");
}
function stockOutCheck (oId) {
	alert("stockOutCheck");
}
function getOneOrderByOId (oId) {
	$.ajax({
		url:'/orders/'+oId,
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {

			}
		}
	})
}

function checkBookList () {
	$("#bookListStockOut").clone(true).appendTo("#bookListInfo");
	$("#bookListInfo")
	$('#checkBookList').modal({
		backdrop: false
	});
}
