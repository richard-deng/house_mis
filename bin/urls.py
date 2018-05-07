# coding: utf-8

from handler import (
    ping,
    page,
    login,
    box_list,
)

urls = (
    # 接口
    ('^/ping$', ping.Ping),
    ('^/house/v1/api/login$', login.LoginHandler),
    ('^/house/v1/api/logout$', login.LogoutHandler),

    # 九宫格
    ('^/house/v1/api/box/list$', box_list.BoxListHandler),
    ('^/house/v1/api/box/create$', box_list.BoxCreateHandler),
    ('^/house/v1/api/box/view$', box_list.BoxViewHandler),
    ('^/house/v1/api/icon/upload$', box_list.UploadIconHandler),


    # 页面
    ('^/$', page.Root),
    ('^/house/v1/page/login.html$', page.Login),
    ('^/house/v1/page/box_list.html$', page.BoxList),

)
