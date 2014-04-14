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
  }
};
function removeTemp (pId) {
	$("#"+pId).remove();
}


/**
 * add the temp to the book list
 */
function addProductToList() {
	//without check
	if ($("#productForm").validationEngine("validate")) {
		var qs = jQuery.parseQuerystring($("form.productAddTemp").serialize());
		var cellData = qs;
		var row = tdCont.row(cellData.PRODUCT_ID);
		var cellName = tdCont.cell(cellData.PRODUCT_NAME);
		var cellPRICE = tdCont.cell(cellData.PRICE);
		// max='20' 
		var cellNum = tdCont.cell($("<input type='number' min='1' id='productNum"+cellData.PRODUCT_ID+"' value='"+cellData.NUM+"'/>"));
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
			row.append(cellRemark);
			row.append(EditLink);
			$("#add_listView").append(row);
			$("input[type='number']").stepper();
		} 
		$('#productID').focus();
		$('.productAddTemp')[0].reset();
	}
	
}

function submitOrder () {
	//alert($("#add_listView").children());
	//$ttd[i].eq(0).find('input').val()
	var $ttr = $("#add_listView").children();
	if (!$ttr.length) {
		bootbox.alert("<h4>列表中无数据</h4>");
		return;
	};
	if ($("#orderCustForm").validationEngine("validate")) {
		var $ttr = $("#add_listView").children();
		var datas = [];
		for (var i = 0; i < $ttr.length; i++) {
			var $ttd = $ttr[i].cells;
			var data = {};
			data["PRODUCT_ID"] = $($ttr[i]).attr("id");
			data["PRODUCT_NAME"] = $($ttd[0]).html();
			data["PRODUCT_COUNT"] = $($ttd[1]).html();
			data["NUM"] = $($ttd).eq(2).find('input').val();
			data["PRICE"] = parseInt($($ttd[1]).html());
			data["OPERATOR"] = "12345678";
			data["REMARK"] = $($ttd[3]).html();
			datas.push(data); 
		};
		var obj = new Object();
		obj["data"] = datas; 
		var jsonString = JSON.stringify(obj); 
		$.ajax({
			url:'/orders',
			type:'POST',
			data:{"jsonStr":jsonString,
					"CUSTOMER_NAME":$("#orderCustName").val(),
					"REMARK":$("#orderRemark").val()},
			dataType: 'json',
			success: function (data) {
				if (data.statusCode === 0) {
					bootbox.alert("<h4>添加订单成功</h4>", function() {
					  $('.productAddTemp')[0].reset();
					  $("#add_listView").html("");
					  $("#orderCustName").val("");
					  $("#orderRemark").val("");
					});
				};
			}
		})
	}

}

function checkBookList () {
	$("#bookListStockOut").clone(true).appendTo("#bookListInfo");
	$('#checkBookList').modal({
		backdrop: false
	});
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
				getProductNum(pId);
				return;
			}else{
				bootbox.alert("<h4>未查询到该产品,请检查!</h4>");
				return;
			}
		}
	})
}

function getProductNum (pId) {
	$.ajax({
		url:"/inventories/"+pId+"/num",
		type:'GET',
		success:function (data) {
			if (data.statusCode === 0) {
				$("#productKucun").val( data.data);
			};
		}
	})
}

jQuery.extend({
  parseQuerystring: function(str){
    var nvpair = {};
    str = decodeURIComponent(str,true);
    var qs = str;
    var pairs = qs.split('&');
    $.each(pairs, function(i, v){
      var pair = v.split('=');
      nvpair[pair[0]] = pair[1];
    });
    return nvpair;
  }
});