/**
 * Created by admin on 2018/5/10.
 */

$(document).ready(function () {

    $('#textList').DataTable({
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
            var $textList_length = $("#textList_length");
            var $textList_paginate = $("#textList_paginate");
            var $page_top = $('.top');

            $page_top.addClass('row');
            $textList_paginate.addClass('col-md-8');
            $textList_length.addClass('col-md-4');
            $textList_length.prependTo($page_top);
        },
        "ajax": function(data, callback, settings){
            var se_userid = window.localStorage.getItem('myid');

            var get_data = {
                'page': Math.ceil(data.start / data.length) + 1,
                'maxnum': data.length,
                'se_userid': se_userid
            };

            var name = $("#text_name").val();

            if(name){
                get_data.name = name;
            }

            $.ajax({
                url: '/mis/v1/api/text/list',
                type: 'GET',
                dataType: 'json',
                data: get_data,
                success: function(data) {
                    var respcd = data.respcd;
                    if(respcd !== '0000'){
                        $processing = $("#textList_processing");
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
                    return '<a href=' + data + '>' + data + '</a>';
                }

            },
            {
                targets: 3,
                render: function (data, type, full) {
                    if (data === 1) {
                        return '启用'
                    } else {
                        return '关闭'
                    }
                }
            },
            {
                targets: 6,
                data: '操作',
                render: function(data, type, full) {
                    var text_id = full.id;
                    var view ="<button type='button' class='btn btn-warning btn-sm viewEdit' data-text_id="+text_id+">"+'查看'+"</button>";
                    return view;
                }
            }
        ],
        'columns': [
            { data: 'name'},
            { data: 'icon'},
            { data: 'content'},
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

    $(document).on('click', '.viewEdit', function(){
        $("label.error").remove();
        var se_userid = window.localStorage.getItem('myid');
        var text_id = $(this).data('text_id');
        $('#text_view').text(text_id);

        var get_data = {};
        get_data.se_userid = se_userid;
        get_data.text_id = text_id;

        $('#textViewForm').resetForm();

        $.ajax({
            url: '/mis/v1/api/text/view',
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
                }
                else {
                    text_data = data.data;

                    $('#text_name_view').val(text_data.name);
                    $('#text_content_view').val(text_data.content);
                    $('#text_available_view').val(text_data.available);
                    $("#text_icon_url_view").attr('src', text_data.icon).show();
                    $('#text_icon_name_view').text(text_data.icon_name);
                    $('#textViewModal').modal();
                }
            },
            error: function(data) {
                toastr.warning('请求异常');
            }
        });

    });
});