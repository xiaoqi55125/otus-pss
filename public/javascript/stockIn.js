var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function(pId) {
    return $("<tr id='"+pId+"'></tr>");
  },
  removeTemp: function(pId) {
    return function() {
      removeTemp(pId);
    }
  }
};

/**
 * add the temp to the book list
 */
function addProductToList() {
	//without check
	if (true) {};


	var qs = jQuery.parseQuerystring($("form.productAddTemp").serialize());
	//alert(qs.NUM);
	var cellData = qs;
	var row = tdCont.row(cellData.PRODUCT_ID);
	var cellId = tdCont.cell($("<div style='display:none'> "+cellData.PRODUCT_ID+"</div>"));

	var cellName = tdCont.cell(cellData.PRODUCT_NAME);
	var cellPRICE = tdCont.cell(cellData.PRICE);
	var cellNum = tdCont.cell($("<input type='number' style='width: 70px;'  id='productNum"+cellData.PRODUCT_ID+"' value='"+cellData.NUM+"'/>"));
	//var cellAmount = tdCont.cell(cellData.AMOUNT);
	//var cellAmount = tdCont.cell(cellData.NUM*cellData.PRICE);
	var cellBatchNum = tdCont.cell(cellData.BATCH_NUM);
	var cellSupplier = tdCont.cell(cellData.SUPPLIER);
	var cellRemark = tdCont.cell(cellData.REMARK);
	var EditLink = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
	EditLink.click(tdCont.removeTemp(cellData.PRODUCT_ID));

	if($("#add_listView:has('#"+cellData.PRODUCT_ID+"')").length > 0)         
	{   
		$("#productNum"+cellData.PRODUCT_ID).val(parseInt($("#productNum"+cellData.PRODUCT_ID).val())+parseInt(cellData.NUM));
		
	}else{
		row.append(cellName);
		row.append(cellPRICE);
		row.append(cellNum);
		//row.append(cellAmount);
		row.append(cellSupplier);
		row.append(cellBatchNum);
		row.append(cellRemark);
		row.append(EditLink);
		$("#add_listView").append(row);
	} 
	
}

function submitStockIn () {
	//without check 
	var $ttr = $("#add_listView").children();
	var datas = [];
	for (var i = 0; i < $ttr.length; i++) {
		var $ttd = $ttr[i].cells;
		var data = {};
		data["PRODUCT_ID"] = $($ttr[i]).attr("id");
		data["PRODUCT_NAME"] = $($ttd[0]).html();
		data["NUM"] = $($ttd).eq(2).find('input').val();
		data["AMOUNT"] = parseInt($($ttd).eq(2).find('input').val()) * parseInt($($ttd[1]).html());
		data["SUPPLIER"] = $($ttd[3]).html();
		data["BATCH_NUM"] = $($ttd[4]).html();
		data["REMARK"] = $($ttd[5]).html();
		datas.push(data); 
	};
	var obj = new Object();
	obj["data"] = datas; 
	var jsonString = JSON.stringify(obj); 
	$.ajax({
		url:'/stockins',
		type:'POST',
		data:{"jsonStr":jsonString},
		dataType: 'json',
		success: function (data) {
			if (data.statusCode === 0) {
				bootbox.alert("入库成功", function() {
				  $('.productAddTemp')[0].reset();
				  $("#add_listView").html("");
				});
			};
		}
	})
}

function removeTemp (pId) {
	$("#"+pId).remove();
}

/**
 * get one product info 
 * @param  {string} pId productId
 * @return {object}    
 */
function getProductOneInfo(pId) {
	$.ajax({
		url:"/products/"+pId,
		type:"GET",
		success:function (data) {
			if (data.statusCode === 0 && data.data!=null) {
				var pInfo = data.data;
				$("#productName").val(pInfo.PRODUCT_NAME);
				$("#productPrice").val(pInfo.PRICE);
				$("#productNum").val("1");
				return;
			}else{
				bootbox.alert("未查询到该产品,请检查!");
				return;
			}
		}
	})
}

// function checkProductAndFill (pId) {
// 	var pInfo = getProductOneInfo(pId);
// 	alert(pInfo.PRODUCT_NAME);
// }

jQuery.extend({
  parseQuerystring: function(str){
    var nvpair = {};
    var qs = str;
    var pairs = qs.split('&');
    $.each(pairs, function(i, v){
      var pair = v.split('=');
      nvpair[pair[0]] = decodeURI(pair[1]);
    });
    return nvpair;
  }
});