
var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  getProductBatchs: function(pId) {
    return function() {
      getProductBatchs(pId);
    }
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
						var num = tdCont.cell(iInfo.SUM);
						var EditLink = tdCont.cell($("<a href='javascript:void(0);'>库存详细</a>"));
              			EditLink.click(tdCont.getProductBatchs(iInfo.PRODUCT_ID));
						row.append(pName);
						row.append(num);
						row.append(EditLink);
						$("#add_listView").append(row);
					};
				}else{
					$("#add_listView").html("<h4>暂无记录!</h4>");
				}
				
			}
		}
	})
}

function getProductBatchs (pId) {
	$.ajax({
		url:'/inventories/'+pId,
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {
				var temp =  data.data;
				$("#pb_listView").html("");
				for (var i = temp.length - 1; i >= 0; i--) {
					console.log(i);
					var tempPb = temp[i];
					var row = tdCont.row();
			        var cellBATCH_NUM = tdCont.cell(tempPb.BATCH_NUM);
			        var cellNum = tdCont.cell(tempPb.NUM);
			        row.append(cellBATCH_NUM);
			        row.append(cellNum);
			        $("#pb_listView").append(row);
				};
				$('#productBatchs').modal("show");
			}
		}
	})
}