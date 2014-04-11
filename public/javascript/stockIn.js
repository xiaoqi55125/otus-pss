var tdCont = {
  cell: function(item) {
    return $("<td style='line-height: 35px;'></td>").html(item);
  },
  cellBatch: function(pId,item) {
    return $("<td id='batch_"+pId+"_"+item+"'></td>").html(item);
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
var isExist = 1;

/**
 * add the temp to the book list
 */
function addProductToList() {
	//if the product is not exist , create it 

	if ($("#productForm").validationEngine("validate")) {
		var qs = jQuery.parseQuerystring($("form.productAddTemp").serialize());
		var cellData = qs;
		console.log(cellData);
		if (isExist == 0) {
			createProductQuick(cellData.PRODUCT_ID,cellData.PRODUCT_NAME);
		}
		var row = tdCont.row(cellData.PRODUCT_ID);
		var cellId = tdCont.cell($("<div style='display:none'> "+cellData.PRODUCT_ID+"</div>"));

		var cellName = tdCont.cell(cellData.PRODUCT_NAME);
		var cellPRICE = tdCont.cell(cellData.PRICE);
		var cellNum = tdCont.cell($("<input type='number' min='1'  id='productNum"+cellData.PRODUCT_ID+cellData.BATCH_NUM+"' value='"+cellData.NUM+"'/>"));
		//var cellAmount = tdCont.cell(cellData.AMOUNT);
		//var cellAmount = tdCont.cell(cellData.NUM*cellData.PRICE);
		var cellBatchNum = tdCont.cellBatch(cellData.PRODUCT_ID,cellData.BATCH_NUM);
		var cellSupplier = tdCont.cell(cellData.SUPPLIER);
		var cellRemark = tdCont.cell(cellData.REMARK);
		var EditLink = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
		EditLink.click(tdCont.removeTemp(cellData.PRODUCT_ID));
		//batch_123
		if($("#add_listView:has('#"+cellData.PRODUCT_ID+"')").length > 0 && $("#add_listView:has('#batch_"+cellData.PRODUCT_ID+"_"+cellData.BATCH_NUM+"')").length > 0 )         
		{   
			$("#productNum"+cellData.PRODUCT_ID+cellData.BATCH_NUM).val(parseInt($("#productNum"+cellData.PRODUCT_ID+cellData.BATCH_NUM).val())+parseInt(cellData.NUM));
			
		}else{
			row.append(cellName);
			row.append(cellPRICE);
			row.append(cellNum);
			row.append(cellSupplier);
			row.append(cellBatchNum);
			row.append(cellRemark);
			row.append(EditLink);
			$("#add_listView").append(row);
		} 
		$('#productID').focus();
		isExist = 1;
		$('.productAddTemp')[0].reset();
		$("input[type='number']").stepper();
		
	}
	
}

/**
 * submit some product to pre stockIn
 * @return {null} 
 */
function submitStockIn () {
	var $ttr = $("#add_listView").children();
	if (!$ttr.length) {
		bootbox.alert("<h4>列表中无数据</h4>");
		return;
	};
	var datas = [];
	for (var i = 0; i < $ttr.length; i++) {
		var $ttd = $ttr[i].cells;
		var data = {};
		data["PRODUCT_ID"] = $($ttr[i]).attr("id");
		data["PRODUCT_NAME"] = $($ttd[0]).html();
		data["NUM"] = $($ttd).eq(2).find('input').val();
		data["PRICE"] = $($ttd[1]).html();
		data["SUPPLIER"] = $($ttd[3]).html();
		data["BATCH_NUM"] = $($ttd[4]).html();
		data["REMARK"] = $($ttd[5]).html();
		datas.push(data); 
	};
	var obj = new Object();
	obj["data"] = datas; 
	var jsonString = JSON.stringify(obj); 
	$.ajax({
		url:'/prestockins',
		type:'POST',
		data:{"jsonStr":jsonString},
		dataType: 'json',
		success: function (data) {
			if (data.statusCode === 0) {
				bootbox.alert("<h4>入库成功</h4>", function() {
				  $('.productAddTemp')[0].reset();
				  $("#add_listView").html("");
				});
			};
		}
	})
}

/**
 * remove tr
 * @param  {pId} pId as the id of tr
 * @return {null}     
 */
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
				//$("#productPrice").val(pInfo.PRICE);
				$("#productNum").val("1");
				return;
			}else{
				//bootbox.alert("<h4>未查询到该产品,请检查!</h4>");
				isExist = 0;
				return;
			}
		}
	})
}

function createProductQuick (pId,pName) {
	// with name and id is ok
	$.ajax({
      url:"/products",
      type:"POST",
      data:{"PRODUCT_ID":pId,
  			"PRODUCT_NAME":pName},
      success:function (data) {
        if (data.statusCode === 0) {
          console.log("商品添加成功");
        }else{
          console.log("商品添加失败");
        }
      }
    })
}

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


/**
 * isDigit 
 * @param  {string}  value value
 * @return {Boolean}       
 */
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false;
    } else {
        return true;
    }
}

/**
 * shwo login error tips
 * @param  {string} statusCode status code
 * @return {null}            
 */
function showTip (msg) {
    $("#span_tipMsg").text(msg);
    $("#div_tip").fadeIn(1000);
    $("#div_tip").fadeOut(1000);
}