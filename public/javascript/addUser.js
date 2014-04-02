$(function () {
    $("#div_tip").hide();
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
  }
};

/**
 * js submit form for login
 * @return {null} 
 */
function postAuthUserForm () {
    var pwd = $("#input_pwd").val();
    if (pwd.length === 0) {
        return false;
    }
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
              var EditLink = tdCont.cell($("<a href='javascript:void(0);'>操作</a>"));
              EditLink.click(tdCont.editGroup(userOne.USER_ID));
              row.append(cellUserId);
              row.append(cellUserName);
              row.append(EditLink);
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
