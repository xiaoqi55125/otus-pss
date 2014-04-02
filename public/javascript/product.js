var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  editProduct: function(pId) {
    return function() {
      editProduct(pId);
    }
  }
};
/**
 * get product category to select options
 * @return {null} 
 */
function getProductCates() {
	$.ajax({
		url:"/productcategories",
		type:"GET",
		success:function (data) {
			if (data.statusCode === 0) {
				for (var i = 0; i< data.data.length; i++) {
					var temp = "<option value='" + data.data[i].PC_ID + "'>" + data.data[i].PC_NAME + "</option>";
				$("#proCateType").append(temp);
        $("#proCateTypeE").append(temp);
			};
			$('#proCateType').selectpicker();
      $("#proCateTypeE").selectpicker();
		}
	}
})
}

/**
 * add product 
 */
function addProduct () {
  if(!$("#productID").val()){
    bootbox.alert("请输入产品编号!");
    return;
  }

  if($('#proPrice').val() <= 0 || !$("#proPrice").val()|| !isDigit($('#proPrice').val()) ){
    bootbox.alert("请输入正确的单价!");
    return;
  }
  if($("#proCateType").val() == '0' ){
    bootbox.alert("请选择产品类别!");
    return;
  }
    $.ajax({
      url:"/products",
      type:"POST",
      data:$('form.productAdd').serialize(),
      success:function (data) {
        if (data.statusCode === 0) {
          bootbox.alert("商品添加成功");
        }else{
          bootbox.alert("商品添加失败");
        }
      }
    })

}

function getProducts() {
	$.ajax({
        url: '/products',
        type: 'GET',
        success: function(data) {
            if (data.statusCode === 0) {
            	$("#pd_listView").html("");
                showProduct(data.data);
                if (data.data.length > 10) {
                    $('#paginator_div').show();
                    $('#paginator_div').pagination({
                        items: data.data.total,
                        itemsOnPage: 10,
                        currentPage: pageIndex,
                        cssStyle: 'light-theme',
                        displayedPages: 0,
                        edges: 0,
                        onPageClick: function(pageNum) {
                            
                        }
                    });
                }
            } else {
                $("#pd_listView").html("");
                $('#paginator_div').hide();
            }

        }
    })
}
/**
 * show product catetory data form get url
 * @param  {list} pcList list of Product catetory
 * @return {null}        
 */
function showProduct (pcList) {
	for (var i = pcList.length - 1; i >= 0; i--) {
		var cellData = pcList[i];
		var row = tdCont.row();
		var cellName = tdCont.cell(cellData.PRODUCT_NAME);
		var cellPRICE = tdCont.cell(cellData.PRICE);
		var cellMANU = tdCont.cell(cellData.MANUFACTURE_NAME);
		//var cellManuTime = tdCont.cell(cellData.MANUFACTURE_TIME);
		var EditLink = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
		EditLink.click(tdCont.editProduct(cellData.PRODUCT_ID));
		row.append(cellName);
		row.append(cellPRICE);
		row.append(cellMANU);
		//row.append(cellManuTime);
		row.append(EditLink);
		$("#pd_listView").append(row);
	};
}

function editProduct (pId) {
  $.ajax({
    url:'/products/'+pId,
    type:'GET',
    success:function (data) {
      if (data.statusCode === 0) {
        //fill form 
        var temp = data.data;
        //$("#proCateTypeE").val(temp.PC_ID);
        $('#proCateTypeE').selectpicker('val', temp.PC_ID);
        $("#proName").val(temp.PRODUCT_NAME);
        $("#proPriceE").val(temp.PRICE);
        $("#manuE").val(temp.MANUFACTURE_NAME);
        $("#maDate").val(temp.MANUFACTURE_DATE);
        $("#subpStockInBtn").unbind('click').removeAttr('onclick');
        $("#subpStockInBtn").attr("onclick","eidtProductBtn('"+pId+"')");
        $('#editProduct').modal({
            backdrop: false
          });
      };
    },
    error:function (msg) {
      bootbox.alert("服务器错误");
    }
  })
}

function eidtProductBtn (pId) {
  $.ajax({
      url:"/products/"+pId,
      type:"PUT",
      data:$('form.productEdit').serialize(),
      success:function (data) {
        if (data.statusCode === 0) {
          $('#editProduct').modal('hide');
          bootbox.alert("商品修改成功");
          getProducts();
        }else{
          bootbox.alert("商品修改失败");
        }
      }
    })
}

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