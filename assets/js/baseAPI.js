// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //console.log(options);
    //// 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token' || '')
        }
    }
    options.complete = function(res) {

        //res.responseJSON传回了获取用户信息失败的信息
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //1.强行清除用户token
            localStorage.removeItem('token')
                //2.强行跳转到登录页面
            location.href = '/login.html'
        }
    }


})