$(function() {
    //点击注册账号链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击登录
    $('#link_login').on('click', function() {

        $('.reg-box').hide()
        $('.login-box').show()
    })

    var form = layui.form
    var layer = layui.layer
        //通过form.vert=ify来自定义校验规则
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return "两次输入的密码必须一致"
                }
            }
        })
        //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
            $('#link_login').click()

        })
    })

    //登录登录表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功')
                    //将登陆成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                    //console.log(res.token);
                    //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})