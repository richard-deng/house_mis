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

    # 页面
    ('^/$', page.Root),
    ('^/house/v1/page/login.html$', page.Login),
    ('^/house/v1/page/box_list.html$', page.BoxList),

)
