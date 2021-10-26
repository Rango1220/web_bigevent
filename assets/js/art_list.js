$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        //定义美化时间的过滤器
    template.defaults.imports.dataFormate = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询的参数对象，将来请求数据的时候，需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认2
        cate_id: '', //文章分类的id
        state: '' //文章发布的状态
    }
    initTable()
    initCate()
        //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                console.log(res);
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                console.log(htmlStr);
                $('tbody').html(htmlStr)
                    //通过layui重新渲染表单区域的UI结构
                form.render()
                    //调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败~')
                }
                //试用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                    //console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)

            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
            //console.log(cate_id);
        var state = $('[name=state]').val()
            //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的查询参数数据筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //console.log(total);
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //1分页发生切换的时候，触发jump回调函数
            //2只要调用了laypage.render()函数就会触发jump函数
            jump: function(obj, first) {
                //可以通过first的值来判断是通过哪种方式触发的jump
                //如果first的值为TRUE，证明是方式2触发的，否则就是方式1触发的

                q.pagenum = obj.curr
                    //把最新的条目数赋值到q这个查询参数的pagesize中
                q.pagesize = obj.limit
                    //根据最新的q获取对应的数据列表并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })

    }

    //通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', ".btn-delete", function() {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
            //console.log("ok");
            //询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功！')
                        //当数据删除完成后需要判断当前这一页中是否还有剩余的数据，如果没有剩余的数据了，则需要让页码值-1后，重新调用initTable方法。
                    if (len === 1) {
                        //如果len的值等于1，name证明删除完成之后，页面上没有任何数据了。
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })


})