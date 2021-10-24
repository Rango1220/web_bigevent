$(function() {
        //调用该函数获取用户的基本信息
        getUserInfo()
        $('#btnLogout').on('click', function() {
            layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function(index) {
                //1.清除用户token
                localStorage.removeItem('token')
                    //2.跳转到登录页面
                location.href = '/login.html'

                layer.close(index);
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token' || '')
        // },
        success: function(res) {
            //console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')


            }
            renderAvatar(res.data)

        }
    })
}
//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username
        //2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $('.text-avatar').hide()

    } else {
        //3.2 渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }

}