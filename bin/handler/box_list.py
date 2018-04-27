# coding: utf-8
import logging

from config import cookie_conf
from runtime import g_rt

from house_base import tools as base_tools
from house_base.base_handler import BaseHandler
from house_base.box_list import BoxList
from house_base.response import success
from house_base.session import house_check_session
from zbase.web.validator import (
    with_validator_self, Field, T_INT, T_STR
)

log = logging.getLogger()


class BoxListHandler(BaseHandler):
    _get_handler_fields = [
        Field('page', T_INT, False),
        Field('maxnum', T_INT, False),
        Field('name', T_STR, True),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _get_handler(self):
        data = {}
        params = self.validator.data
        info, num = BoxList.page(**params)
        data['num'] = num
        if info:
            for item in info:
                item['id'] = str(item['id'])
                base_tools.trans_time(item, BoxList.DATETIME_KEY)
        data['info'] = info
        return success(data=data)
