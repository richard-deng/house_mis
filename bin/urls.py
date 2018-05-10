# coding: utf-8

from handler import (
    ping,
    page,
    login,
    box_list,
    order,
    text,
)

urls = (
    # 接口
    ('^/ping$', ping.Ping),
    ('^/mis/v1/api/login$', login.LoginHandler),
    ('^/mis/v1/api/logout$', login.LogoutHandler),

    # 九宫格
    ('^/mis/v1/api/box/list$', box_list.BoxListHandler),
    ('^/mis/v1/api/box/create$', box_list.BoxCreateHandler),
    ('^/mis/v1/api/box/view$', box_list.BoxViewHandler),
    ('^/mis/v1/api/icon/upload$', box_list.UploadIconHandler),

    # 订单
    ('^/mis/v1/api/order/list$', order.OrderListHandler),
    ('^/mis/v1/api/order/create$', order.OrderCreateHandler),

    # 文本
    ('^/mis/v1/api/text/list$', text.TextInfoListHandler),
    ('^/mis/v1/api/text/create$', text.TextInfoCreateHandler),


    # 页面
    ('^/$', page.Root),
    ('^/mis/v1/page/login.html$', page.Login),
    ('^/mis/v1/page/box_list.html$', page.BoxList),

)
