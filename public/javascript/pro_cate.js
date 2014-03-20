var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  editpc: function(pcId) {
    return function() {
      editProductCatetory(pcId);
    }
  }
};

function addandEditPcType (add,pcId) {
	//without check 
	var url ,type ,successStr;
	if (add == 1) {
		url = "/productcategories";
		type = "POST";
		successStr = "添加商品类别成功!";
	}else{
		url = "/productcategories/"+pcId;
		type = "PUT";
		successStr = "修改商品类别成功!";
	}
	$.ajax({
		url:url,
		type:type,
		data:{'PC_NAME':$("#pc_name").val(),'REMARK':$("#pc_remark").val()},
		success:function (data) {
			if (data.statusCode === 0) {
				bootbox.alert(successStr, function() {
				  getProductCatetory ();
				  $("#addandEditBtn").unbind('click').removeAttr('onclick');
				  $("#addandEditBtn").attr("onclick","addandEditPcType(1)");
				  $("#pc_name").val("");
				  $("#pc_remark").val("");
				  $("#addandEditBtn").html("添加商品类别");
				});
			}
		}
	})
}

function getProductCatetory () {
	$.ajax({
        url: '/productcategories',
        type: 'GET',
        success: function(data) {
            if (data.statusCode === 0) {
            	$("#pc_listView").html("");
                showProductCatetory(data.data);
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
                $("#pc_listView").html("");
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
function showProductCatetory (pcList) {
	for (var i = pcList.length - 1; i >= 0; i--) {
		var cellData = pcList[i];
		var row = tdCont.row();
		var cellName = tdCont.cell(cellData.PC_NAME);
		var cellRemark = tdCont.cell(cellData.REMARK);
		var EditLink = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
		EditLink.click(tdCont.editpc(cellData.PC_ID));
		row.append(cellName);
		row.append(cellRemark);
		row.append(EditLink);
		$("#pc_listView").append(row);
	};
}
/**
 * edit product catetory 
 * @param  {string} pcId product catetory id
 * @return {null}      
 */
function editProductCatetory (pcId) {
	$.ajax({
		url:"/productcategories/"+pcId,
		type:"GET",
		success:function (data) {
			if (data.statusCode === 0) {
				$("#pc_name").val(data.data.PC_NAME);
				$("#pc_remark").val(data.data.REMARK);
				$("#addandEditBtn").unbind('click').removeAttr('onclick');
				$("#addandEditBtn").attr("onclick","addandEditPcType(0,'"+pcId+"')");
				$("#addandEditBtn").html("修改商品类别");
			}
		}
	});
}
/**
 * submit the edit data
 * @return {null} 
 */
function submitPcEdit () {
	addandEditPcType();
}