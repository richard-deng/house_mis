$(document).ready(function(){
    initial_banner();

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
