/**
 * @Desc 登录页面
 * @Date 2018-09-17 00:52:03
 * @Author qitian
 */

let SELECT_USERACCOUNT_URL = requestUrl + "api/generate/userinformation/selectAccount"; //url地址 分页查询
let PASSWORD_CHECK_URL = requestUrl + "api/generate/userinformation/passwordIsTrue"; //url地址 类目新增

$("#username").blur(function () {
    $.ajax({
        url: SELECT_USERACCOUNT_URL,
        type: requestJson ? 'get' : 'post',
        data: {
            useraccount: $("#username").val()
        },
        dataType: "json",
        // contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                $("#warn").html("")
            } else {
                $("#warn").html(data.message)
            }
        }
    })
});
$("#login").click(function () {
    $.ajax({
        url: PASSWORD_CHECK_URL,
        type: requestJson ? 'get' : 'post',
        data: {
            useraccount: $("#username").val(),
            userpassword: $("#password").val()
        },
        dataType: "json",
        // contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                console.log(data)
                window.location.href = '../../pages/default/default.html';
                //遍历得到类目名称
            } else {
                $("#loginwarn").html(data.message);
            }
        }
    })
})