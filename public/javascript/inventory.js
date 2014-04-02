
var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  }
};

function getAllInventories () {
	$.ajax({
		url:'/inventories',
		type:'get',
		success:function (data) {
			if (data.statusCode === 0) {
				var invs = data.data;
				$("#add_listView").html("");
				if (invs.length) {
					for (var i = 0; i < invs.length; i++) {
						var iInfo = invs[i];
						var row = tdCont.row();
						var pName = tdCont.cell(iInfo.PRODUCT_NAME);
						var num = tdCont.cell(iInfo.NUM);
						var price = tdCont.cell(iInfo.PRICE);
						var manName = tdCont.cell(iInfo.MANUFACTURE_NAME);
						// var manDate ;
						// if (moment(iInfo.MANUFACTURE_DATE).isValid()) {
						// 	manDate = tdCont.cell(moment(iInfo.MANUFACTURE_DATE).format("YYYY年 M月 D日 H:mm:ss"));
						// }else{
						// 	manDate = tdCont.cell('无');
						// }
						row.append(pName);
						row.append(num);
						row.append(price);
						row.append(manName);
						//row.append(manDate);
						$("#add_listView").append(row);
					};
				}else{
					$("#add_listView").html("<h4>暂无记录!</h4>");
				}
				
			}
		}
	})
}