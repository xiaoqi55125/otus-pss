$(function () {
    $("#div_tip").hide();
});

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
                bootbox.dialog({
                  message: "添加成功，请选择操作",
                  title: "成功提示",
                  buttons: {
                    success: {
                      label: "继续添加",
                      className: "btn-primary",
                      callback: function() {
                        $("#signinForm")[0].reset() 
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
