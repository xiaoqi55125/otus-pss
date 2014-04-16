var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function(pId) {
    return $("<tr id='"+pId+"'></tr>");
  },
  rowInner: function() {
    return $("<tr></tr>");
  }
};
function getOrderById (oId) {
	$.ajax({
		url:"/orders/"+oId,
		type:"GET",
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
					var cellName = tdCont.cell(cellData.PRODUCT_NAME+" ("+cellData.PRODUCT_ID+") ");
					var cellNum = tdCont.cell(cellData.NUM);
					row.append(cellName);
					row.append(cellNum);
					$("#astStockOut_listView").append(row);
				}
				$.ajax({
					url:"/stockouts/"+oId,
					type:"GET",
					success:function (data) {
						if (data.statusCode === 0 ) {

							for (var i = 0; i < data.data.length; i++) {
								var cellData = data.data[i];
								var row = tdCont.rowInner();
								var cellBacthNum = tdCont.cell("<div id='bar_"+cellData.BATCH_NUM+"'></div>");
								var cellCnt = tdCont.cell(cellData.NUM);
								row.append(cellBacthNum);
								row.append(cellCnt);
								$("tr#"+cellData.PRODUCT_ID).after(row);
								$("#bar_"+cellData.BATCH_NUM).barcode(cellData.BATCH_NUM, "codabar");  
							};
						};
					}
				})
			}
		}
	});

}
