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
        url     : "/signin",
        type    : "POST",
        async   : false,
        cache   : false,
        data    : {
            "auth[userId]"      : $("#input_userId").val(),
            "auth[passwd]"      : crypedPwd
        },
        success : function (statusCode) {
            if (statusCode) {
                if (statusCode === "1") {
                    window.location="/";
                } else {
                    showTip(statusCode);
                }
            }

            return false;
        },
        error   : function (msg) {
            console.log(msg);
            showTip("3");
        }
    });

    return false;
    // $(".container .form-signin input").filter("[type*='password']").val(crypedPwd);
    // document.forms["signinForm"].submit();
}

/**
 * shwo login error tips
 * @param  {string} statusCode status code
 * @return {null}            
 */
function showTip (statusCode) {
    if (statusCode === "0") {
        $("#span_tipMsg").text("登陆失败");
    } else if (statusCode === "2") {
        $("#span_tipMsg").text("用户不存在");
    } else if (statusCode === "3") {
        $("#span_tipMsg").text("服务器错误");
    } else if (statusCode === "4") {
        $("#span_tipMsg").text("验证码错误");
    } else if (statusCode === "5") {
        $("#span_tipMsg").text("认证信息为空或存在非法字符");
    }

    $("#div_tip").fadeIn(1000);
    $("#div_tip").fadeOut(1000);
}