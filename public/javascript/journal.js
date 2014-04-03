var tdCont = {
  cell: function(item) {
    return $("<td style='line-height: 35px;'></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  jDetailsStockOut: function(oId) {
    return function() {
      jDetailsStockOut(oId);
    }
  },
  jDetailsStockIn: function(data) {
    return function() {
      jDetailsStockIn(data);
    }
  },
  jDetailsOrder: function(oId) {
    return function() {
      jDetailsOrder(oId);
    }
  },
  jDetailsPreStockIn:function (data) {
    return function () {
      jDetailsPreStockIn(data);
    }
  }
};

function getJournals (tpId,sDate,eDate) {
  var getData ;
  if (tpId == 0) {
    getData ={};
  }else{
    getData={'jtId':tpId};
  }
  $.ajax({
    url:'/journals?from_dt='+sDate+'&to_dt='+eDate,
    type:'GET',
    data:getData,
    success:function (data) {
      if (data.statusCode === 0) {
        $("#add_listView").html("");
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var oInfo = data.data[i];
            var row = tdCont.row();
            var cellName;
            var jDetails = tdCont.cell($("<a href='javascript:void(0);'>查看详情</a>"));
            if (oInfo.JT_NAME == 'STOCK_IN') {
              cellName = tdCont.cell("入库");
              jDetails.click(tdCont.jDetailsStockIn(oInfo.JOURNAL_CONTENT));

            }else if(oInfo.JT_NAME == 'ORDERS') {
              cellName = tdCont.cell("订单");
              jDetails.click(tdCont.jDetailsOrder(oInfo.JOURNAL_CONTENT));
            }else if(oInfo.JT_NAME == 'PRE_STOCK_IN'){
              cellName = tdCont.cell("预入库，待确认");
              jDetails.click(tdCont.jDetailsPreStockIn(oInfo.JOURNAL_CONTENT));
            }else{
              cellName = tdCont.cell("出库");
              jDetails.click(tdCont.jDetailsStockOut(oInfo.JOURNAL_CONTENT));
            }
            var userName = tdCont.cell(oInfo.USER_NAME);
            var addTime = tdCont.cell(moment(oInfo.DATETIME).format("YYYY年 M月 D日 , H:mm:ss"));
            row.append(cellName);
            row.append(addTime);
            row.append(userName);
            row.append(jDetails);
            $("#add_listView").append(row);
          }
        }else{
          $("#add_listView").html("<h4>暂无记录!</h4>");
        }
        
      }
    }
  })
}

function searchJourByDate () {
  getJournals($('#JourType').val(),$("#sDate").val(),$("#eDate").val());
}


function getAllJournaltypes () {
  $.ajax({
    url:'/journaltypes',
    type:'GET',
    success:function(data){
      if (data.statusCode === 0) {
        for (var i = data.data.length - 1; i >= 0; i--) {
          var oneType = data.data[i];
          var temp = "<option value='" + oneType.JT_ID + "'>" + oneType.REMARK + "</option>";
          $("#JourType").append(temp);
        };
        $('#JourType').selectpicker();
       
      }
    },
  });
}



function jDetailsStockOut (oId) {
  $.ajax({
    url:'/orders/'+oId,
    type:'GET',
    success:function (data) {
      if (data.statusCode === 0) {
        $("#astStockOut_listView").html("");
        $("#lastStockOutCustName").html(data.data.CUSTOMER_NAME);
        $("#lastStockOutTime").html(moment(data.data.DATETIME).format("YYYY年 M月 D日 , H:mm:ss"));
        $("#lastStockOutRemark").html(data.data.REMARK);
        var tempStr = data.data.ORDER_CONTENT;
        var datas = eval('(' + tempStr + ')');  
        var list = datas.data;
        for (var i = 0; i < list.length; i++) {
          var cellData = list[i];
          var row = tdCont.row(cellData.PRODUCT_ID);
          var cellName = tdCont.cell(cellData.PRODUCT_NAME);
          var cellNum = tdCont.cell(cellData.NUM);
          var cellPRICE = tdCont.cell(cellData.PRICE);
          var cellRemark = tdCont.cell(cellData.REMARK);
          row.append(cellName);
          row.append(cellPRICE);
          row.append(cellNum);
          
          row.append(cellRemark);
          $("#astStockOut_listView").append(row);
        }
        $('#checkStockOut').modal("show");
      }else{
        bootbox.alert("服务器出错!");
      }
    }
  })
}

function jDetailsPreStockIn (data) {
  var datas = eval('(' + data + ')');  
  var tempData = datas.data;
  $("#astStockIn_listView").html("");
  for (var i = 0; i < tempData.length; i++) {
    var cellData = tempData[i];
    var row = tdCont.row();
    var cellName = tdCont.cell(cellData.PRODUCT_NAME);
    var cellNum = tdCont.cell(cellData.NUM);
    var cellBATCH_NUM = tdCont.cell(cellData.BATCH_NUM);
    var cellSupplier = tdCont.cell(cellData.SUPPLIER);
    var cellRemark = tdCont.cell(cellData.REMARK);
    row.append(cellName);
    row.append(cellNum);
    //row.append(cellPRICE);
    row.append(cellBATCH_NUM);
    row.append(cellSupplier);
    row.append(cellRemark);
    $("#astStockIn_listView").append(row);
    $('#checkStockIn').modal("show");
  };
}

function jDetailsStockIn (data) {
  var datas = eval('(' + data + ')');  
  //var tempData = datas.data;
  $("#astStockIn_listView").html("");
  for (var i = 0; i < datas.length; i++) {
    var cellData = datas[i];
    var row = tdCont.row();
    var cellName = tdCont.cell(cellData.PRODUCT_NAME);
    var cellNum = tdCont.cell(cellData.NUM);
    var cellBATCH_NUM = tdCont.cell(cellData.BATCH_NUM);
    var cellSupplier = tdCont.cell(cellData.SUPPLIER);
    var cellRemark = tdCont.cell(cellData.REMARK);
    row.append(cellName);
    row.append(cellNum);
    //row.append(cellPRICE);
    row.append(cellBATCH_NUM);
    row.append(cellSupplier);
    row.append(cellRemark);
    $("#astStockIn_listView").append(row);
    $('#checkStockIn').modal("show");
  };
  
}
function jDetailsOrder (data) {
  var datas = eval('(' + data + ')');  
  $.ajax({
    url:'/orders/'+datas.ORDER_ID,
    type:'GET',
    success:function (data) {
      if (data.statusCode === 0) {
        $("#order_listView").html("");
        $("#orderCustName").html(data.data.CUSTOMER_NAME);
        $("#orderTime").html(moment(data.data.DATETIME).format("YYYY年 M月 D日 , H:mm:ss"));
        $("#orderRemark").html(data.data.REMARK);
        var tempStr = data.data.ORDER_CONTENT;
        var datas = eval('(' + tempStr + ')');  
        var list = datas.data;
        for (var i = 0; i < list.length; i++) {
          var cellData = list[i];
          var row = tdCont.row(cellData.PRODUCT_ID);
          var cellName = tdCont.cell(cellData.PRODUCT_NAME);
          //var cellPRICE = tdCont.cell(cellData.AMOUNT);
          var cellNum = tdCont.cell(cellData.NUM);
          var cellCount = tdCont.cell(cellData.PRODUCT_COUNT);
          var cellRemark = tdCont.cell(cellData.REMARK);
          row.append(cellName);
          row.append(cellNum);
          //row.append(cellPRICE);
          row.append(cellCount);
          row.append(cellRemark);
          $("#order_listView").append(row);
        }
        $('#checkOrder').modal("show");
      }else{
        bootbox.alert("服务器出错!");
      }
    }
  })
}