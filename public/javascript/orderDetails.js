var tdCont = {
  cell: function(item) {
    return $("<td style='line-height: 35px;'></td>").html(item);
  },

  row: function(pId) {
    return $("<tr id='"+pId+"'></tr>");
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
					var cellName = tdCont.cell(cellData.PRODUCT_NAME);
					//var cellPRICE = tdCont.cell(cellData.AMOUNT);
					var cellNum = tdCont.cell(cellData.NUM);
					var cellCount = tdCont.cell(cellData.PRODUCT_COUNT);
					var cellRemark = tdCont.cell(cellData.REMARK);
					row.append(cellName);
					row.append(cellNum);
					//row.append(cellPRICE);
					row.append(cellCount);
					row.append(cellRemark);
					$("#astStockOut_listView").append(row);
				}
			}
		}
	})
}
