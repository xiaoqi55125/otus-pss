var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function(psId) {
    return $("<tr id='"+psId+"'></tr>");
  },
  proStockDetail: function(psId) {
    return function() {
      proStockDetail(psId);
    }
  }
};


function getAllPreStockInList(pageIndex) {
	$.ajax({
		url:'/prestockins?pageIndex='+pageIndex,
		type:"get",
		success:function (data) {
			if (data.statusCode === 0) {
				var tempStr = data.data.items;
				if (!tempStr.length) {
					$("#add_listView").html("<h4>暂无记录!</h4>");
				}else{
					$("#add_listView").html("");
					for (var i = 0; i < tempStr.length; i++) {
						var cellData = tempStr[i];
						var row = tdCont.row(cellData.PSI_ID);
						var cellTime = tdCont.cell(moment(cellData.PSI_TIME).format("YYYY年 M月 D日 H:mm:ss"));
						var cellOpeator = tdCont.cell(cellData.USER_NAME);
						var cellRemark = tdCont.cell(cellData.REMARK);
						var cellDetails = tdCont.cell($("<a href='javascript:void(0);'>查看详情</a>"));
						cellDetails.click(tdCont.proStockDetail(cellData.PSI_ID));
						row.append(cellTime);
						row.append(cellOpeator);
						row.append(cellRemark);
						row.append(cellDetails);
						$("#add_listView").append(row);
						
			          };
					}
					$('#paginator_div').pagination('destroy');
					var pageInfo = data.data.pagingInfo;
		          	if (pageInfo.totalNum>10) {
		            	$('#paginator_div').pagination({
		              	items: data.data.pagingInfo.totalNum,
		              	itemsOnPage: 10,
		              	currentPage: pageInfo.pageIndex+1,
		              	cssStyle: 'light-theme',
		              	onPageClick: function(pageNum){
		                	getAllPreStockInList(pageNum-1);
		              	}
		            });
				}
				
			}
		}
	})
}

function proStockDetail (psId) {
	$.ajax({
		url:'/prestockins/'+psId,
		type:'get',
		success:function (data) {
			if (data.statusCode === 0) {
				var tempStr = data.data.PSI_CONTENT;
				var datas = eval('(' + tempStr + ')');  
				//var list = datas.data;
				var list = datas;
				$("#p_listView").html("");
				for (var i = 0; i < list.length; i++) {
					var cellData = list[i];
					var row = tdCont.row(cellData.PRODUCT_ID);
					var cellPId = tdCont.cell(cellData.PRODUCT_ID);
					var cellName = tdCont.cell(cellData.PRODUCT_NAME);
					var cellNum = tdCont.cell(cellData.NUM);
					var cellBatchNum = tdCont.cell(cellData.BATCH_NUM);
					var cellSUPPLIER = tdCont.cell(cellData.SUPPLIER);
					row.append(cellName);
					row.append(cellPId);
					row.append(cellBatchNum);
					row.append(cellNum);
					row.append(cellSUPPLIER);
					$("#p_listView").append(row);
				}
				$("#subpStockInBtn").unbind('click').removeAttr('onclick');
			  	$("#subpStockInBtn").attr("onclick","submitPreStockIn('"+psId+"')");
				$('#subpStockIn').modal({
					backdrop: false
				});
			};
		}
	})
	
}

function submitPreStockIn (psId) {
	$.ajax({
		url:"/stockins/"+psId,
		type:'post',
		success:function (data) {
			if (data.statusCode ===0) {
				bootbox.alert("<h4>确定入库成功!</h4>");
				getAllPreStockInList();
				$('#subpStockIn').modal('hide');
			}else{
				bootbox.alert("<h4>确定入库失败,请重试</h4>");
				$('#subpStockIn').modal('hide');
			}
		}
	})
}