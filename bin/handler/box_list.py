# coding: utf-8
import logging

from config import SAVE_PATH
from config import cookie_conf
from config import BASE_URL
from runtime import g_rt
from tools import gen_now_str
from house_base import tools as base_tools
from house_base.base_handler import BaseHandler
from house_base.box_list import BoxList
from house_base.response import success, error, RESP_CODE
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
                icon_name = item['icon']
                item['icon'] = BASE_URL + icon_name
                base_tools.trans_time(item, BoxList.DATETIME_KEY)
        data['info'] = info
        return success(data=data)


class UploadIconHandler(BaseHandler):

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        data = self.req.input()
        all_name = data.get('name')
        name = all_name.split('.')[1]
        file = data.get('file')
        content = file.read()
        now_str = gen_now_str()
        filename =  now_str + '.' +name
        full_name = SAVE_PATH + filename
        with open(full_name, 'wb+') as f:
            f.write(content)
        icon_url = "/static/upload/icon/" + filename
        return success(data={"icon_url": icon_url, "icon_name": filename})


class BoxCreateHandler(BaseHandler):

    _post_handler_fields = [
        Field('name', T_STR, False),
        Field('available', T_INT, False),
        Field('priority', T_INT, False),
        Field('icon', T_STR, False),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        params = self.validator.data
        # 检查名称
        ret = BoxList.create(params)
        log.debug("class=BoxCreateHandler|create ret=%s", ret)
        if ret != 1:
            return error(errcode=RESP_CODE.DATAERR)
        return success(data={})


