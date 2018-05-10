/**
 * Created by admin on 2018/5/10.
 */
$(document).ready(function () {

    $('#orderList').DataTable({
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
            var $orderList_length = $("#orderList_length");
            var $orderList_paginate = $("#orderList_paginate");
            var $page_top = $('.top');

            $page_top.addClass('row');
            $orderList_paginate.addClass('col-md-8');
            $orderList_length.addClass('col-md-4');
            $orderList_length.prependTo($page_top);
        },
        "ajax": function(data, callback, settings){
            var se_userid = window.localStorage.getItem('myid');

            var get_data = {
                'page': Math.ceil(data.start / data.length) + 1,
                'maxnum': data.length,
                'se_userid': se_userid
            };

            var goods_name = $("#goods_name").val();

            if(goods_name){
                get_data.goods_name = goods_name;
            }

            $.ajax({
                url: '/mis/v1/api/order/list',
                type: 'GET',
                dataType: 'json',
                data: get_data,
                success: function(data) {
                    var respcd = data.respcd;
                    if(respcd !== '0000'){
                        $processing = $("#orderList_processing");
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
                targets: 3,
                render: function (data, type, full) {
                    return '<a href=' + data + '>' + data + '</a>';
                }

            },
            {
                targets: 6,
                data: '操作',
                render: function(data, type, full) {
                    var order_id = full.id;
                    var view ="<button type='button' class='btn btn-warning btn-sm viewEdit' data-order_id="+order_id+">"+'查看'+"</button>";
                    return view;
                }
            }
        ],
        'columns': [
            { data: 'goods_name'},
            { data: 'goods_price'},
            { data: 'goods_desc'},
            { data: 'goods_picture'},
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

});