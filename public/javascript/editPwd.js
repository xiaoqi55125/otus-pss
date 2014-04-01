
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


/**
 * js submit form for login
 * @return {null} 
 */
function AutoPwd () {
    var pwd = $("#input_pwd").val();
    if (pwd.length === 0) {
        showTip("旧密码为空!");
    }
    var crypedPwd = CryptoJS.MD5(pwd) + "";
    $.ajax({
        url     : "/signin",
        type    : "POST",
        async   : false,
        cache   : false,
        data    : {
            "auth[userId]"      : $("#userId").val(),
            "auth[passwd]"      : crypedPwd
        },
        success : function (statusCode) {
            if (statusCode) {
                if (statusCode === "1") {
                    var newpwd = $("#input_pwd2").val();
                    if (newpwd.length === 0) {
                        showTip("新密码为空!");
                    }
                    var crypedNewPwd = CryptoJS.MD5(newpwd) + "";
                    $.ajax({
                        url:"/users/"+$("#userId").val(),
                        type:"PUT",
                        async   : false,
                        data:{
                            'USER_NAME':$("#userName").val(),
                            "PASSWORD":crypedNewPwd,
                            "REMARK":"editPwd"
                            },
                        success:function (data) {
                            if (data.statusCode === 0) {
                                showTip("密码修改成功!");
                            };
                        },
                        error:function (msg) {
                            console.log(msg);
                        }
                    });

                } else {
                    showTip("旧密码验证不通过!");
                }
            }
        },
        error   : function (msg) {
            console.log(msg);
        }
    });
}