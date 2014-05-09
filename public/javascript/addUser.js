

$(function () {
    $("#div_tip").hide();
    // 定义一个判断函数
  var in_array = function(arr){

      // 遍历是否在数组中
      for(var i=0,k=arr.length;i<k;i++){
          if(this==arr[i]){
              return true;    
          }
      }
   
      // 如果不在数组中就会返回false
      return false;
  }
   
  // 给字符串添加原型
  String.prototype.in_array = in_array;
  // 给数字类型添加原型
  Number.prototype.in_array = in_array;
});


var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function(uId) {
    return $("<tr></tr>");
  },
  editGroup: function(uId) {
    return function() {
      editGroup(uId);
    }
  },
  deleteUser: function(uId) {
    return function() {
      deleteUser(uId);
    }
  }
};

/**
 * js submit form for login
 * @return {null} 
 */
function postAuthUserForm () {
    var pwd = $("#input_pwd").val();

    var crypedPwd = CryptoJS.MD5(pwd) + "";

    $.ajax({
        url     : "/users",
        type    : "POST",
        async   : false,
        cache   : false,
        data    : {
            "USER_ID"      : $("#input_userId").val(),
            "PASSWORD"      : crypedPwd,
            "USER_NAME"    : $("#input_uname").val(),
        },
        success : function (data) {
            if (data.statusCode === 0) {
                showTip("0");
                getAllUsers ();
                if($("#groupSelect").val() == '0' ){
                  //to-do
                }else{
                  addUserGroup($("#input_userId").val(),0);
                }
                
                bootbox.dialog({
                  message: "添加成功，请选择操作",
                  title: "成功提示",
                  buttons: {
                    success: {
                      label: "继续添加",
                      className: "btn-primary",
                      callback: function() {
                        $("#signinForm")[0].reset();
                      }
                    },
                    danger: {
                      label: "返回首页",
                      className: "btn-primary",
                      callback: function() {
                        window.location="/";
                      }
                    }
                  }
                });
            } else {
                showTip(data.statusCode);
            }
        },
        error   : function (msg) {
            console.log(msg);
            showTip(3);
        }
    });

    return false;
}

function getAllGroups () {
  $.ajax({
    url:'securitygroups',
    type:'get',
    async   : false,
    success:function (data) {
      if (data.statusCode === 0 ) {

          for (var i = data.data.length - 1; i >= 0; i--) {
            var group = data.data[i];
            var temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
            $("#groupSelect").append(temp);
          };
          $('#groupSelect').selectpicker();
        
      }
    }
  })
}


function getAllUsers () {
  $.ajax({
    url:'/users',
    type:'GET',
    success:function(data){
      if (data.statusCode === 0) {
          if (data.data.length) {
            $("#add_listViewUser").html("");
            for (var i = data.data.length - 1; i >= 0; i--) {
              var userOne = data.data[i];
              var row = tdCont.row();
              var cellUserId = tdCont.cell(userOne.USER_ID);
              var cellUserName = tdCont.cell(userOne.USER_NAME);
              var EditLink = tdCont.cell($("<a href='javascript:void(0);'>配置权限</a>"));
              EditLink.click(tdCont.editGroup(userOne.USER_ID));
              var EditLinkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
              EditLinkDel.click(tdCont.deleteUser(userOne.USER_ID));
              row.append(cellUserId);
              row.append(cellUserName);
              row.append(EditLink);
              row.append(EditLinkDel);
              $("#add_listViewUser").append(row);

            };
          }else{
            $("#add_listViewUser").html("<h4>暂无记录!</h4>");
          }
      }
    },
    error: function(jqXHR, exception) {
       console.log(exception); 
    }
  })
}

function deleteUser (userId) {
  bootbox.confirm("确认删除用户吗?", function () {
    $.ajax({
      url:'/user/'+userId,
      type:'delete',
      success:function (data) {
        if (data.statusCode === 0) {
          getAllUsers();
        }
      }
    })
  })
}

/**
 * add user group after user create
 * @param {string} uId userId
 */
function addUserGroup (uId,fromId) {
  var groupId;
  if (fromId == 0) {
    groupId = $("#groupSelect").val();
  }else{
    if($("#groupSelectModal").val() == 0){
      bootbox.alert("<h4>权限未选择!</h4>")
    }else{
      groupId = $("#groupSelectModal").val();
    }
  }
  $.ajax({
    url:'usersecuritygroups',
    type:"POST",
    data:{"userId":uId,
          "groupId":groupId},
    success:function (data) {
      if (data.statusCode === 0) {
        if (fromId==0) {
            console.log("分配权限成功!");
        }else{
          bootbox.alert("<h4>权限分配成功!</h4>");
          $('#UserGroup').modal('hide');
        }
      }
    }
  })
}

function editGroup (userId) {
  $.ajax({
    url:'securitygroups',
    type:'get',
    async   : false,
    success:function (data) {
      if (data.statusCode === 0 ) {
        $("#groupSelectModal").empty();
        $("#groupSelectModal").append(' <option value="0">-- 请选择权限组 --</option>');
        var temp;
        for (var i = data.data.length - 1; i >= 0; i--) {
          var group = data.data[i];
          $.ajax({
            url:'/users/'+userId+'/securitygroups',
            type:'get',
            async   : false,
            success:function (data2) {
              if (data2.statusCode === 0) {
                var datas = new Array();
                for (var i = data2.data.length - 1; i >= 0; i--) {
                  var userGroup = data2.data[i];
                  datas[i] = userGroup.GROUP_ID;
                };
                if(datas.length){
                  if (group.GROUP_ID.in_array(datas)) {
                     temp = "<option disabled='disabled' value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
                  }else{
                     temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
                  }
                }else{
                   temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
                }
                
              };
            }
          })
          $("#groupSelectModal").append(temp);
          $('#groupSelectModal').selectpicker('refresh');
          $("#editGroupSubmit").unbind('click').removeAttr('onclick');
          $("#editGroupSubmit").attr("onclick","addUserGroup('"+userId+"',1)");
          $('#UserGroup').modal('show');
        }
      };
    }
  })
}

/**
 * shwo login error tips
 * @param  {string} statusCode status code
 * @return {null}            
 */
function showTip (statusCode) {
    if (statusCode === 0) {
        $("#span_tipMsg").text("添加用户成功！");
    } else if (statusCode === 2) {
        $("#span_tipMsg").text("用户名已存在，请更换后重试！");
    } else if (statusCode === 3) {
        $("#span_tipMsg").text("服务器错误");
    } 

    $("#div_tip").fadeIn(1000);
    $("#div_tip").fadeOut(1000);
}
