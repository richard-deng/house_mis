# coding: utf-8
import logging

from config import BANNER_TEXT
from config import cookie_conf
from runtime import g_rt
from house_base.base_handler import BaseHandler
from house_base.response import success, error, RESP_CODE
from house_base.session import house_check_session

from zbase.web.validator import (
    with_validator_self, Field, T_INT, T_STR
)

log = logging.getLogger()


class BannerViewHandler(BaseHandler):

    _get_handler_fields = []

    _post_handler_fields = [
        Field('content', T_STR, False)
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _get_handler(self):
        data = {'content': ''}
        with open(BANNER_TEXT, 'rb') as f:
            content = f.read()
            data['content'] = content
        return success(data=data)

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        params = self.validator.data
        content = params['content']
        with open(BANNER_TEXT, 'wb') as f:
            f.write(content)
        return success(data={})
