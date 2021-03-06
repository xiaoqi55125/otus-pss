var tdCont = {
  cell: function(item) {
    return $("<td style='line-height: 35px;'></td>").html(item);
  },

  row: function(pId) {
    return $("<tr id='"+pId.toUpperCase()+"'></tr>");
  },
  removeTemp: function(pId) {
    return function() {
      removeTemp(pId.toUpperCase());
    }
  }
};
function removeTemp (pId) {
	$("#"+pId.toUpperCase()).remove();
}


/**
 * add the temp to the book list
 */
function addProductToList() {
	//without check
	if ($("#productForm").validationEngine("validate")) {
		var qs = jQuery.parseQuerystring($("form.productAddTemp").serialize());
		var cellData = qs;
		console.log(productIsExist(cellData.PRODUCT_ID));
		if(!productIsExist(cellData.PRODUCT_ID)){
			bootbox.alert("<h4>未查询到该产品,请检查!</h4>");
			return;
		}
		var row = tdCont.row(cellData.PRODUCT_ID.toUpperCase());
		var cellPid = tdCont.cell(cellData.PRODUCT_ID.toUpperCase());
		var cellName = tdCont.cell(cellData.PRODUCT_NAME);
		var cellPRICE = tdCont.cell(cellData.PRICE);
		// max='20' 
		var cellNum = tdCont.cell($("<input type='number' min='1' id='productNum"+cellData.PRODUCT_ID.toUpperCase()+"' value='"+cellData.NUM+"'/>"));
		var cellRemark = tdCont.cell(cellData.REMARK);
		var EditLink = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
		EditLink.click(tdCont.removeTemp(cellData.PRODUCT_ID));

		if($("#add_listView:has('#"+cellData.PRODUCT_ID+"')").length > 0)         
		{   
			$("#productNum"+cellData.PRODUCT_ID).val(parseInt($("#productNum"+cellData.PRODUCT_ID).val())+parseInt(cellData.NUM));
		}else{
			row.append(cellName);
			row.append(cellPid);
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
			data["PRODUCT_COUNT"] = $($ttd[2]).html();
			data["NUM"] = $($ttd).eq(3).find('input').val();
			data["PRICE"] = parseInt($($ttd[2]).html());
			data["OPERATOR"] = $("#currentUserId").html();
			data["OPERATORNAME"] = $("#currentUserName").html();
			data["REMARK"] = $($ttd[4]).html();
			datas.push(data); 
		};
		// var obj = new Object();
		// obj["data"] = datas; 
		var jsonString = JSON.stringify(datas); 
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
	}else{
		bootbox.alert("<h4>客户名称未填写</h4>",function () {
			$("#orderCustForm").focus();
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
				//$("#productNum").val("1");
				getProductNum(pId);
				return;
			}else{
				bootbox.alert("<h4>未查询到该产品,请检查!</h4>");
				return;
			}
		}
	})
}
function productIsExist(pId) {
	var res = 0;
	$.ajax({
		url:"/products/"+pId,
		type:"GET",
		async: false,  
		success:function (data) {
			if (data.statusCode === 0 && data.data!=null) {
				res = 1;
			}else{
				//bootbox.alert("<h4>未查询到该产品,请检查!</h4>");
				res = 0;
			}
		}
	});
	return res;
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

function getProductsByLikeId (likeId) {
	$.ajax({
		url:'/product/productIds/'+likeId,
		type:'get',
		success:function (data) {
	      if (data.statusCode === 0) {
	      	//$('#autocomplete').autocomplete('clear');
	        var productsItem = [];
	        for (var i = data.data.length - 1; i >= 0; i--) {
	        	productsItem.push(data.data[i].PRODUCT_ID);
	        };
	        $('#productID').autocomplete({
	          lookup: productsItem,
	          lookupLimit:10,
	          minChars: 0,
	          onSelect: function(suggestion) {
	            console.log(suggestion.value);
	            getProductOneInfo(suggestion.value); 
	            $("#productForm").validationEngine("hide");
	          }
	        });
	      }
		}
	})
}
function getAllCustomers () {
	$.ajax({
		url:'/orders/all/customers',
		type:'get',
		success:function (data) {
			if (data.statusCode === 0) {
				var customers = [];
		        for (var i = data.data.length - 1; i >= 0; i--) {
		        	if (data.data[i].CUSTOMER_NAME) {
		        		customers.push(data.data[i].CUSTOMER_NAME);
		        		console.log(data.data[i].CUSTOMER_NAME);
		        	};
		        	
		        };
		        $('#orderCustName').autocomplete({
		          lookup: customers,
		          lookupLimit:10,
		          minChars: 0,
		          onSelect: function(suggestion) {
		            console.log(suggestion.value);
		          }
		        });
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