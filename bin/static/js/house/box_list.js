/**
 * Created by admin on 2018/4/27.
 */
$(document).ready(function(){

    $.validator.addMethod("isMobile", function(value, element) {
        var length = value.length;
        var mobile = /^(1\d{10})$/;
        return this.optional(element) || (length === 11 && mobile.test(value));
    }, "请正确填写您的手机号码");

    $('#boxList').DataTable({
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
            var $boxList_length = $("#boxList_length");
            var $boxList_paginate = $("#boxList_paginate");
            var $page_top = $('.top');

            $page_top.addClass('row');
            $boxList_paginate.addClass('col-md-8');
            $boxList_length.addClass('col-md-4');
            $boxList_length.prependTo($page_top);
        },
        "ajax": function(data, callback, settings){
            var se_userid = window.localStorage.getItem('myid');

            var get_data = {
                'page': Math.ceil(data.start / data.length) + 1,
                'maxnum': data.length,
                'se_userid': se_userid
            };

            var name = $("#box_name").val();

            if(name){
                get_data.name = name;
            }
            
            $.ajax({
                url: '/mis/v1/api/box/list',
                type: 'GET',
                dataType: 'json',
                data: get_data,
                success: function(data) {
                    var respcd = data.respcd;
                    if(respcd !== '0000'){
                        $processing = $("#boxList_processing");
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
                    if (data === 0) {
                        return '订单';
                    } else {
                        return '文本';
                    }
                }
            },
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
                    var box_id = full.id;
                    var box_type = full.box_type;
                    var box_type_name = '';
                    if (box_type === 0) {
                        box_type_name = '添加订单';
                    } else {
                        box_type_name = '添加文本';
                    }
                    var view ="<button type='button' class='btn btn-warning btn-sm viewEdit' data-box_id="+box_id+">"+'查看'+"</button>";
                    var box ="<button type='button' class='btn btn-primary btn-sm addBox' data-box_id="+box_id+" data-box_type="+box_type+">"+box_type_name+"</button>";
                    return view + box;
                }
            }
        ],
        'columns': [
            { data: 'name'},
            { data: 'box_type'},
            { data: 'icon'},
            { data: 'priority'},
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

    $("#box_search").click(function(){

        var user_query_vt = $('#users_query').validate({
            rules: {
                s_merchant_id: {
                    required: false
                },
                s_mobile: {
                    required: false,
                    // maxlength: 11
                    isMobile: '#s_mobile'
                }
            },
            messages: {
                s_merchant_id: {
                    required: '请输入商户ID'
                },
                s_mobile: {
                    required: '请输入手机号'
                    // maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串")
                }
            },
            errorPlacement: function(error, element){
                var $error_element = element.parent().parent().next();
                $error_element.text('');
                error.appendTo($error_element);
            }
        });
        var ok = user_query_vt.form();
        if(!ok){
            $("#query_label_error").show();
            $("#query_label_error").fadeOut(1400);
            return false;
        }
        $('#boxList').DataTable().draw();
    });


    $(document).on('click', '.viewEdit', function(){
        $("label.error").remove();
        var se_userid = window.localStorage.getItem('myid');
        var box_id = $(this).data('box_id');
        $('#view_box_id').text(box_id);

        var get_data = {};
        get_data.se_userid = se_userid;
        get_data.box_id = box_id;
        $('#boxViewForm').resetForm();
        $.ajax({
	        url: '/mis/v1/api/box/view',
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
                    box_data = data.data;

                    $('#box_name_view').val(box_data.name);
                    $('#box_type_view').val(box_data.box_type);
                    $('#box_available_view').val(box_data.available);
                    $('#box_priority_view').val(box_data.priority);
                    $("#box_icon_url_view").attr('src', box_data.icon).show();
                    $('#box_icon_name_view').text(box_data.icon_name);
                    $('#boxViewModal').modal();
                }
	        },
	        error: function(data) {
                toastr.warning('请求异常');
	        }
        });

    });


    $('#boxViewSubmit').click(function(){
        var box_view_vt = $('#boxViewForm').validate({
            rules: {
                box_name_view: {
                    required: true,
                    maxlength: 32
                },
                box_priority_view: {
                    required: false,
                    maxlength: 20,
                    digits: true
                }
            },
            messages: {
                box_name_view: {
                    required: '请输入名称',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串")
                },
                box_priority_view: {
                    required: '请输入优先级',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                    digits: '必须输入整数'
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

        var ok = box_view_vt.form();
        if(!ok){
            return false;
        }

        icon_src = $("#box_icon_url_view")[0].src;
        if(icon_src === "") {
            return false;
        }

        var se_userid = window.localStorage.getItem('myid');

        var post_data = {};
        post_data.se_userid = se_userid;
        post_data.name = $('#box_name_view').val();
        post_data.box_type = $('#box_type_view').val();
        post_data.priority = $('#box_priority_view').val();
        post_data.available = $('#box_available_view').val();
        post_data.icon = $("#box_icon_name_view").text();
        post_data.box_id = $("#view_box_id").text();

        $.ajax({
	        url: '/mis/v1/api/box/view',
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
                    $("#boxViewForm").resetForm();
                    $("#boxViewModal").modal('hide');
                    $('#boxList').DataTable().draw();
                }
	        },
	        error: function(data) {
                toastr.warning('请求异常');
	        }
        });

    });


    $('#box_create').click(function(){
        $('#boxCreateForm').resetForm();
        $("label.error").remove();
        $('#boxCreateModal').modal();
    });

    $('#boxCreateSubmit').click(function(){

        var box_create_vt = $('#boxCreateForm').validate({
            rules: {
                box_name_add: {
                    required: true,
                    maxlength: 32
                },
                box_priority_add: {
                    required: false,
                    maxlength: 20,
                    digits: true
                }
            },
            messages: {

                box_name_add: {
                    required: '请输入名称',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串")
                },
                box_priority_add: {
                    required: '请输入优先级',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                    digits: '必须输入整数'
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

        var ok = box_create_vt.form();
        if(!ok){
            return false;
        }
        icon_src = $("#box_icon_url_add")[0].src;
        if(icon_src === "") {
            return false;
        }

        var se_userid = window.localStorage.getItem('myid');

        var post_data = {};
        post_data.se_userid = se_userid;
        post_data.name = $('#box_name_add').val();
        post_data.box_type = $('#box_type_add').val();
        post_data.priority = $('#box_priority_add').val();
        post_data.available = $('#box_available_add').val();
        post_data.icon = $("#box_icon_name_add").text();

        $.ajax({
	        url: '/mis/v1/api/box/create',
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
                    toastr.success('添加成功');
                    $("#boxCreateForm").resetForm();
                    $("#boxCreateModal").modal('hide');
                    $('#boxList').DataTable().draw();
                }
	        },
	        error: function(data) {
                toastr.warning('请求异常');
	        }
        });

    });

    $(document).on('click', '.addBox', function(){
        var box_id = $(this).data('box_id');
        var box_type = $(this).data('box_type');
        console.log('box_id=', box_id, 'box_type=', box_type);
        if (box_type === 0) {
            // 订单
            $('#orderCreateForm').resetForm();
            $("label.error").remove();
            $('#order_add').text(box_id);
            $('#orderCreateModal').modal();
        } else {
            // 文本
            $('#textCreateForm').resetForm();
            $("label.error").remove();
            $('#text_add').text(box_id);
            $('#textCreateModal').modal();
        }
    });

    $('#orderCreateSubmit').click(function () {
        var order_create_vt = $('#orderCreateForm').validate({
            rules: {
                goods_name_add: {
                    required: true,
                    maxlength: 32
                },
                goods_price_add: {
                    required: false,
                    maxlength: 20,
                    digits: true
                },
                goods_desc_add: {
                    required: true,
                    maxlength: 1024
                }
            },
            messages: {

                goods_name_add: {
                    required: '请输入商品名称',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串")
                },
                goods_price_add: {
                    required: '请输入商品价格',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                    digits: '必须输入整数'
                },
                goods_desc_add: {
                    required: '请输入商品名称',
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

        var ok = order_create_vt.form();
        if(!ok){
            return false;
        }
        picture_src = $("#goods_picture_url_add")[0].src;
        if(picture_src === "") {
            return false;
        }

        var se_userid = window.localStorage.getItem('myid');

        var post_data = {};
        post_data.se_userid = se_userid;
        post_data.box_id = $('#order_add').text();
        post_data.goods_name = $("#goods_name_add").val();
        post_data.goods_price = $('#goods_price_add').val();
        post_data.goods_desc = $('#goods_desc_add').val();
        post_data.goods_picture = $('#goods_picture_name_add').text();

        $.ajax({
            url: '/mis/v1/api/order/create',
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
                    toastr.success('添加成功');
                    $("#orderCreateForm").resetForm();
                    $("#orderCreateModal").modal('hide');
                    // 切换到order列表页面
                }
            },
            error: function(data) {
                toastr.warning('请求异常');
            }
        });

    });

    $('#textCreateSubmit').click(function () {
        var text_create_vt = $('#textCreateForm').validate({
            rules: {
                text_name_add: {
                    required: true,
                    maxlength: 32
                },
                text_content_add: {
                    required: true,
                    maxlength: 500
                }
            },
            messages: {

                text_name_add: {
                    required: '请输入名称',
                    maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串")
                },
                text_content_add: {
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

        var ok = text_create_vt.form();
        if(!ok){
            return false;
        }
        icon_src = $("#text_icon_url_add")[0].src;
        if(icon_src === "") {
            return false;
        }

        var se_userid = window.localStorage.getItem('myid');

        var post_data = {};
        post_data.se_userid = se_userid;
        post_data.box_id = $('#text_add').text();
        post_data.name = $("#text_name_add").val();
        post_data.content = $('#text_content_add').val();
        post_data.available = $('#text_available_add').val();
        post_data.icon = $('#text_icon_name_add').text();

        $.ajax({
            url: '/mis/v1/api/text/create',
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
                    toastr.success('添加成功');
                    $("#textCreateForm").resetForm();
                    $("#textCreateModal").modal('hide');
                    // 切换到text列表页面
                }
            },
            error: function(data) {
                toastr.warning('请求异常');
            }
        });


    });

});

function upload_file(obj) {
    var se_userid = window.localStorage.getItem('myid');
    var formData = new FormData();
    var name = $("#iconCreateUpload").val();
    formData.append("file", $("#iconCreateUpload")[0].files[0]);
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
            $("#box_icon_url_add").attr('src', src).show();
            $("#box_icon_name_add").text(name);
        },
        error: function (response) {
            console.log(response);
        }
    });
}


function upload_view_file(obj) {
    var se_userid = window.localStorage.getItem('myid');
    var formData = new FormData();
    var name = $("#iconViewUpload").val();
    formData.append("file", $("#iconViewUpload")[0].files[0]);
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
            $("#box_icon_url_view").attr('src', src).show();
            $("#box_icon_name_view").text(name);
        },
        error: function (response) {
            console.log(response);
        }
    });
}


function upload_goods_picture_file(obj) {
    var se_userid = window.localStorage.getItem('myid');
    var formData = new FormData();
    var name = $("#goodsPictureCreateUpload").val();
    formData.append("file", $("#goodsPictureCreateUpload")[0].files[0]);
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
            $("#goods_picture_url_add").attr('src', src).show();
            $("#goods_picture_name_add").text(name);
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function upload_text_icon_file(obj) {
    var se_userid = window.localStorage.getItem('myid');
    var formData = new FormData();
    var name = $("#textIconCreateUpload").val();
    formData.append("file", $("#textIconCreateUpload")[0].files[0]);
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
            $("#text_icon_url_add").attr('src', src).show();
            $("#text_icon_name_add").text(name);
        },
        error: function (response) {
            console.log(response);
        }
    });
}