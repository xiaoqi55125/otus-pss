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
  if ($("#productForm").validationEngine("validate")) {
     $.ajax({
      url:"/products",
      type:"POST",
      data:$('form.productAdd').serialize(),
      success:function (data) {
        if (data.statusCode === 0) {
          bootbox.alert("<h4>商品添加成功</h4>");
          $('#productForm')[0].reset();
          getProducts();
        }else{
          bootbox.alert("<h4>商品添加失败</h4>");
        }
      }
    })
   }

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
    var cellId = tdCont.cell(cellData.PRODUCT_ID);
		var cellName = tdCont.cell(cellData.PRODUCT_NAME);
		//var cellPRICE = tdCont.cell(cellData.PRICE);
		var cellMANU = tdCont.cell(cellData.MANUFACTURE_NAME);
		//var cellManuTime = tdCont.cell(cellData.MANUFACTURE_TIME);
		var EditLink = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
		EditLink.click(tdCont.editProduct(cellData.PRODUCT_ID));
    row.append(cellId);
		row.append(cellName);
		//row.append(cellPRICE);
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
        $("#manuE").val(temp.MANUFACTURE_NAME);
        $("#subpStockInBtn").unbind('click').removeAttr('onclick');
        $("#subpStockInBtn").attr("onclick","eidtProductBtn('"+pId+"')");
        $('#editProduct').modal({
            backdrop: false
          });
      };
    },
    error:function (msg) {
      bootbox.alert("<h4>服务器错误</h4>");
    }
  })
}

function eidtProductBtn (pId) {
  if ($("#productForm2").validationEngine("validate")) {
    $.ajax({
      url:"/products/"+pId,
      type:"PUT",
      data:$('form.productEdit').serialize(),
      success:function (data) {
        if (data.statusCode === 0) {
          $('#editProduct').modal('hide');
          bootbox.alert("<h4>商品修改成功</h4>");
          getProducts();
        }else{
          bootbox.alert("<h4>商品修改失败</h4>");
          $('#editProduct').modal('hide');
        }
      }
    })

  }
  
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