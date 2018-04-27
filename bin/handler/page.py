# coding: utf-8
from zbase.web import core
from zbase.web import template
from house_base.session import house_check_session_for_page
from config import cookie_conf
from runtime import g_rt

import logging

log = logging.getLogger()


class Root(core.Handler):
    def GET(self):
        self.redirect('/house/v1/page/login.html')


class Login(core.Handler):
    def GET(self):
        self.write(template.render('login.html'))


class BoxList(core.Handler):
    @house_check_session_for_page(g_rt.redis_pool, cookie_conf)
    def GET(self):
        self.write(template.render('box_list.html'))