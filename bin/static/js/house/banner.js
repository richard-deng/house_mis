$(document).ready(function(){

    $('#bannerList').DataTable({
        "autoWidth": false,     //通常被禁用作为优化
        "processing": true,
        "serverSide": true,
        "paging": true,         //制指定它才能显示表格底部的分页按钮
        "info": true,
        "ordering": false,
        "searching": false,
        "lengthChange": true,
        "deferRender": true,
        "iDisplayLength": 10,
        "sPaginationType": "full_numbers",
        "lengthMenu": [[10, 40, 100],[10, 40, 100]],
        "dom": 'l<"top"p>rt',
        "fnInitComplete": function(){
            var $bannerList_length = $("#bannerList_length");
            var $bannerList_paginate = $("#bannerList_paginate");
            var $page_top = $('.top');

            $page_top.addClass('row');
            $bannerList_paginate.addClass('col-md-8');
            $bannerList_length.addClass('col-md-4');
            $bannerList_length.prependTo($page_top);
        },
        "ajax": function(data, callback, settings){
            var se_userid = window.localStorage.getItem('myid');

            var get_data = {
                'page': Math.ceil(data.start / data.length) + 1,
                'maxnum': data.length,
                'se_userid': se_userid
            };

            var title = $("#banner_title").val();

            if(title){
                get_data.title = title;
            }

            $.ajax({
                url: '/mis/v1/api/banner/list',
                type: 'GET',
                dataType: 'json',
                data: get_data,
                success: function(data) {
                    var respcd = data.respcd;
                    if(respcd !== '0000'){
                        $processing = $("#bannerList_processing");
                        $processing.css('display', 'none');
                        var resperr = data.resperr;
                        var respmsg = data.respmsg;
                        var msg = resperr ? resperr : respmsg;
                        toastr.warning(msg);
                        return false;
                    } else {
                        detail_data = data.data;
                        num = detail_data.num;
                        callback({
                            recordsTotal: num,
                            recordsFiltered: num,
                            data: detail_data.info
                        });
                    }
                },
                error: function(data) {
                    toastr.warning('请求数据异常');
                }

            });
        },
        'columnDefs': [
            {
                targets: 1,
                render: function (data, type, full) {
                    if (data === 1) {
                        return '启用'
                    } else {
                        return '关闭'
                    }
                }
            },
            {
                targets: 4,
                data: '操作',
                render: function(data, type, full) {
                    var banner_id = full.id;
                    return "<button type='button' class='btn btn-info btn-sm viewEdit' data-banner_id="+banner_id+">"+'编辑'+"</button>";
                }
            }
        ],
        'columns': [
            { data: 'title'},
            { data: 'available'},
            { data: 'ctime'},
            { data: 'utime'}
        ],
        'oLanguage': {
            'sProcessing': '<span style="color:red;">加载中....</span>',
            'sLengthMenu': '每页显示_MENU_条记录',
            "sInfo": '显示 _START_到_END_ 的 _TOTAL_条数据',
            'sInfoEmpty': '没有匹配的数据',
            'sZeroRecords': '没有找到匹配的数据',
            'oPaginate': {
                'sFirst': '首页',
                'sPrevious': '前一页',
                'sNext': '后一页',
                'sLast': '尾页'
            }
        }
    });


    function initial_banner(){
        var se_userid = window.localStorage.getItem('myid');
        var get_data = {};
        get_data.se_userid = se_userid;
        $.ajax({
            url: '/mis/v1/api/banner/view',
            type: 'GET',
            dataType: 'json',
            data: get_data,
            success: function(data) {
                var respcd = data.respcd;
                if(respcd !== '0000'){
                    var resperr = data.resperr;
                    var respmsg = data.respmsg;
                    var msg = resperr ? resperr : respmsg;
                    toastr.warning(msg);
                    return false;
                } else {
                    detail_data = data.data;
                    content = detail_data.content;
                    $('#banner_edit').val(content);
                }
            },
            error: function(data) {
                toastr.warning('请求数据异常');
            }

        });
    }

    $('#save_banner').click(function(){
        var se_userid = window.localStorage.getItem('myid');
        var post_data = {};
        post_data.se_userid = se_userid;
         var content = $('#banner_edit').val();
         if(!content){
             toastr.warning('请填写横幅内容然后保存');
             return false;
         }

         post_data.content = content;
         $.ajax({
	     url: '/mis/v1/api/banner/view',
	     type: 'POST',
	     dataType: 'json',
	     data: post_data,
	     success: function(data) {
                 var respcd = data.respcd;
                 if(respcd !== '0000'){
                     var resperr = data.resperr;
                     var respmsg = data.respmsg;
                     var msg = resperr ? resperr : respmsg;
                     toastr.warning(msg);
                     return false;
                 }
                 else {
                     toastr.success('保存修改成功');
                 }
	     },
	     error: function(data) {
                 toastr.warning('请求异常');
	     }
         });
    });

});
