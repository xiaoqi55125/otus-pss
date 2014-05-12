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

function getJournals (tpId,sDate,eDate,pageIndex) {
  var getData ;
  if (tpId == 0) {
    getData ={};
  }else{
    getData={'jtId':tpId};
  }
  $.ajax({
    url:'/journals?from_dt='+sDate+'&to_dt='+eDate+'&pageIndex='+pageIndex,
    type:'GET',
    data:getData,
    success:function (data) {
      if (data.statusCode === 0) {
        $("#add_listView").html("");
        if (data.data.items.length) {
          for (var i = 0; i < data.data.items.length; i++) {
            var oInfo = data.data.items[i];
            var row = tdCont.row();
            var cellName;
            var jDetails = tdCont.cell($("<a href='javascript:void(0);'>查看详情</a>"));
            if(oInfo.JT_NAME == 'ORDERS') {
              cellName = tdCont.cell("订单");
              jDetails.click(tdCont.jDetailsOrder(oInfo.JOURNAL_CONTENT));
            }else if(oInfo.JT_NAME == 'PRE_STOCK_IN'){
              cellName = tdCont.cell("预入库，待确认");
              jDetails.click(tdCont.jDetailsPreStockIn(oInfo.JOURNAL_CONTENT));
            }else{
              // cellName = tdCont.cell("出库");
              // jDetails.click(tdCont.jDetailsStockOut(oInfo.JOURNAL_CONTENT));
            }
            var userName = tdCont.cell(oInfo.USER_NAME);
            var addTime = tdCont.cell(moment(oInfo.DATETIME).format("YYYY年 M月 D日 , H:mm:ss"));
            row.append(cellName);
            row.append(addTime);
            row.append(userName);
            row.append(jDetails);
            $("#add_listView").append(row);
          }
          var pageInfo = data.data.pagingInfo;
          $('#paginator_div').pagination('destroy');
          if (pageInfo.totalNum>10) {

            $('#paginator_div').pagination({
              items: data.data.pagingInfo.totalNum,
              itemsOnPage: 10,
              currentPage: pageInfo.pageIndex+1,
              cssStyle: 'light-theme',
              onPageClick: function(pageNum){
                getJournals($('#JourType').val(),$("#sDate").val(),$("#eDate").val(),pageNum-1);
              }
            });
          };
        }else{
          $("#add_listView").html("<h4>暂无记录!</h4>");
        }
        
      }
    }
  })
}
function getJournals2 (tpId,sDate,eDate,pageIndex,pId) {
  var getData , getUrl ,getUrlStatistics;
  if (tpId == 0) {
    getData ={};
  }else{
    getData={'jtId':tpId};
  }
  getUrl = '/stockjournals?from_dt='+sDate+'&to_dt='+eDate+'&pageIndex='+pageIndex+'&productId='+pId;
  getUrlStatistics = '/stockjournals/statistics?from_dt='+sDate+'&to_dt='+eDate+'&pageIndex='+pageIndex+'&productId='+pId;
  getStatistics(getUrlStatistics);

  $.ajax({
    url:getUrl,
    type:'GET',
    data:getData,
    success:function (data) {
      if (data.statusCode === 0) {
        $("#add_listView1").html("");
        if (data.data.items.length) {
          for (var i = 0; i < data.data.items.length; i++) {
            var oInfo = data.data.items[i];
            var row = tdCont.row();
            var cellName;
            var jDetails = tdCont.cell($("<a href='javascript:void(0);'>查看详情</a>"));
            if (oInfo.JT_NAME == 'STOCK_IN') {
              cellName = tdCont.cell("入库");
              jDetails.click(tdCont.jDetailsStockIn(oInfo.RELATED_ID));

            }else{
              cellName = tdCont.cell("出库");
              jDetails.click(tdCont.jDetailsStockOut(oInfo.RELATED_ID));
            }
            var userName = tdCont.cell(oInfo.OPERATOR_NAME);

            var addTime = tdCont.cell(moment(oInfo.OPERATE_TIME).format("YYYY年 M月 D日 , H:mm:ss"));
            row.append(cellName);
            row.append(addTime);
            row.append(userName);
            row.append(jDetails);
            $("#add_listView1").append(row);
          }
          var pageInfo = data.data.pagingInfo;
          $('#paginator_div1').pagination('destroy');
          if (pageInfo.totalNum>10) {

            $('#paginator_div1').pagination({
              items: data.data.pagingInfo.totalNum,
              itemsOnPage: 10,
              currentPage: pageInfo.pageIndex+1,
              cssStyle: 'light-theme',
              onPageClick: function(pageNum){
                getJournals2(0,$("#sDate2").val(),$("#eDate2").val(),pageNum-1,pId);
              }
            });
          };
        }else{
          $("#add_listView1").html("<h4>暂无记录!</h4>");
        }
        
      }
    }
  })
}

function searchJourByDate () {
  getJournals(0,$("#sDate").val(),$("#eDate").val(),0);
}
function searchJourByDate2 () {
  getJournals2(0,$("#sDate2").val(),$("#eDate2").val(),0,$("#stockProductInput").val());
}

function getStatistics (url) {
  $.ajax({
    type:'get',
    url:url,
    success:function (data) {
      if (data.statusCode === 0) {
        $("#showStatInner").html("");
        var tempData = data.data;
        if (tempData.length) {
          var temp ;
          temp = "<span style='font-size:24px'>";

          if (tempData[0].sum && tempData[0].JT_NAME == 'STOCK_IN') {
            temp += "<span class='label label-primary'>入库数量 "+tempData[0].sum+"</span> ";
          };

          if (tempData[0].sum && tempData[0].JT_NAME == 'STOCK_OUT') {
            temp += "<span class='label label-success'>出库数量 "+tempData[0].sum+"</span> ";
          };

          if (tempData.length >1 && tempData[1].JT_NAME == 'STOCK_IN') {
            temp += "<span class='label label-primary'>入库数量 "+tempData[1].sum+"</span> ";
          };

          if (tempData.length >1 && tempData[1].JT_NAME == 'STOCK_OUT') {
            temp += "<span class='label label-success'>出库数量 "+tempData[1].sum+"</span> ";
          };
          
          temp += "</span>"
          $("#showStatInner").html(temp);
          $("#showStat").show();
        }else{
          $("#showStat").hide();
        }
       
      }
    }
  })
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



function jDetailsStockOut (relateId) {

  $.ajax({
    type:'get',
    url:'/stockjournals/'+relateId+'/records',
    success:function (data) {
      if (data.statusCode === 0) {
          var tempData = data.data;
          $("#astStockOut_listView").html("");
          for (var i = 0; i < tempData.length; i++) {
            var cellData = tempData[i];
            var row = tdCont.row();
            var cellpID = tdCont.cell(cellData.PRODUCT_ID);
            var cellName = tdCont.cell(cellData.PRODUCT_NAME);
            var cellBATCH_NUM = tdCont.cell(cellData.BATCH_NUM);
            var cellNum = tdCont.cell(cellData.NUM);
            var cellSupplier = tdCont.cell(cellData.SUPPLIER);



            row.append(cellpID);
            row.append(cellName);
            row.append(cellBATCH_NUM);
            row.append(cellNum);
            //row.append(cellPRICE);
            row.append(cellSupplier);
            $("#astStockOut_listView").append(row);
            $('#checkStockOut').modal("show");
          };
  
      }
    }
  })
}

function jDetailsPreStockIn (data) {
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

function jDetailsStockIn (relateId) {
  $.ajax({
    type:'get',
    url:'/stockjournals/'+relateId+'/records',
    success:function (data) {
      if (data.statusCode === 0) {
          var tempData = data.data;
          $("#astStockIn_listView").html("");
          for (var i = 0; i < tempData.length; i++) {
            var cellData = tempData[i];
            var row = tdCont.row();
            var cellpID = tdCont.cell(cellData.PRODUCT_ID);
            var cellName = tdCont.cell(cellData.PRODUCT_NAME);
            var cellBATCH_NUM = tdCont.cell(cellData.BATCH_NUM);
            var cellNum = tdCont.cell(cellData.NUM);
            var cellSupplier = tdCont.cell(cellData.SUPPLIER);



            row.append(cellpID);
            row.append(cellName);
            row.append(cellBATCH_NUM);
            row.append(cellNum);
            //row.append(cellPRICE);
            row.append(cellSupplier);
            $("#astStockIn_listView").append(row);
            $('#checkStockIn').modal("show");
          };
  
      }
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
          $('#stockProductInput').autocomplete({
            lookup: productsItem,
            lookupLimit:10,
            minChars: 0,
            onSelect: function(suggestion) {
              console.log(suggestion.value);
              
            }
          });
        }
    }
  })
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
        //var list = datas.data;
        var list = datas;
        for (var i = 0; i < list.length; i++) {
          var cellData = list[i];
          var row = tdCont.row(cellData.PRODUCT_ID);
          var cellName = tdCont.cell(cellData.PRODUCT_NAME);
          //var cellPRICE = tdCont.cell(cellData.AMOUNT);
          var cellNum = tdCont.cell(cellData.NUM);
          var cellCount = tdCont.cell(cellData.PRODUCT_COUNT);
          var cellRemark = tdCont.cell(cellData.REMARK);
          row.append(cellName);
          row.append(cellCount);
          row.append(cellNum);
          //row.append(cellPRICE);
          
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