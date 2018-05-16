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
                targets: 2,
                render: function (data, type, full) {
                    return '<a href=' + data + '>' + data + '</a>';
                }

            },
            {
                targets: 4,
                render: function (data, type, full) {
                    if (data === 1) {
                        return '启用'
                    } else {
                        return '关闭'
                    }
                }
            },
            {
                targets: 7,
                data: '操作',
                render: function(data, type, full) {
                    var text_id = full.id;
                    var view ="<button type='button' class='btn btn-warning btn-sm viewEdit' data-text_id="+text_id+">"+'查看'+"</button>";
                    return view;
                }
            }
        ],
        'columns': [
            { data: 'box_name'},
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

    $('#textViewSubmit').click(function () {
        var text_view_vt = $('#textViewForm').validate({
            rules: {
                text_name_view: {
                    required: true,
                    maxlength: 32
                },
                text_content_view: {
                    required: true,
                    maxlength: 500
                }
            },
            messages: {

                text_name_view: {
                    required: '请输入名称',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串")
                },
                text_content_view: {
                    required: '请输入内容',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串")
                }
            },
            errorPlacement: function(error, element){
                if(element.is(':checkbox')){
                    error.appendTo(element.parent().parent().parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });

        var ok = text_view_vt.form();
        if(!ok){
            return false;
        }
        icon_src = $("#text_icon_url_view")[0].src;
        if(icon_src === "") {
            return false;
        }

        var se_userid = window.localStorage.getItem('myid');

        var post_data = {};
        post_data.se_userid = se_userid;
        post_data.text_id = $('#text_view').text();
        post_data.name = $("#text_name_view").val();
        post_data.content = $('#text_content_view').val();
        post_data.available = $('#text_available_view').val();
        post_data.icon = $('#text_icon_name_view').text();

        $.ajax({
            url: '/mis/v1/api/text/view',
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
                    toastr.success('修改');
                    $("#textViewForm").resetForm();
                    $("#textViewModal").modal('hide');
                    $('#textList').DataTable().draw();
                }
            },
            error: function(data) {
                toastr.warning('请求异常');
            }
        });
    });

    $("#text_search").click(function(){

        var text_query_vt = $('#text_list_query').validate({
            rules: {
                text_name: {
                    required: false,
                    maxlength: 32
                }
            },
            messages: {
                text_name: {
                    required: '请输入名称'
                }
            },
            errorPlacement: function(error, element){
                var $error_element = element.parent().parent().next();
                $error_element.text('');
                error.appendTo($error_element);
            }
        });
        var ok = text_query_vt.form();
        if(!ok){
            $("#query_label_error").show();
            $("#query_label_error").fadeOut(1400);
            return false;
        }
        $('#textList').DataTable().draw();
    });
});

function upload_text_icon_view(obj) {
    var se_userid = window.localStorage.getItem('myid');
    var formData = new FormData();
    var name = $("#textIconViewUpload").val();
    formData.append("file", $("#textIconViewUpload")[0].files[0]);
    formData.append("name", name);
    formData.append("se_userid", se_userid);
    $.ajax({
        url: "/mis/v1/api/icon/upload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            console.log("before send ");
        },
        success: function (data) {
            console.log(data);
            detail_data = data.data;
            src = detail_data.icon_url;
            name = detail_data.icon_name;
            $("#text_icon_url_view").attr('src', src).show();
            $("#text_icon_name_view").text(name);
        },
        error: function (response) {
            console.log(response);
        }
    });
}