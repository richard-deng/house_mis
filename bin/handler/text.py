# coding: utf-8
import logging

from config import cookie_conf
from config import BASE_URL
from runtime import g_rt
from house_base import tools as base_tools
from house_base.base_handler import BaseHandler
from house_base.box_list import BoxList
from house_base.text_info import TextInfo
from house_base.text_info import TextDetail
from house_base.response import success, error, RESP_CODE
from house_base.session import house_check_session

from zbase.web.validator import (
    with_validator_self, Field, T_INT, T_STR
)

log = logging.getLogger()

class TextInfoCreateHandler(BaseHandler):

    _post_handler_fields = [
        Field('box_id', T_INT, False),
        Field('name', T_STR, False),
        Field('content', T_STR, True),
        Field('icon', T_STR, False),
        Field('available', T_INT, False),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        params = self.validator.data
        content = params.pop('content')
        box_id = params.get('box_id')
        box = BoxList(box_id)
        box.load()
        if not box.data:
            return error(errcode=RESP_CODE.DATAERR)
        # 检查名称
        ret, text_id = TextInfo.create(params)
        log.debug('class=TextInfoCreateHandler|create text info ret=%s', ret)
        if ret != 1:
            return error(errcode=RESP_CODE.DATAERR)
        detail_values = {
            'content': content,
            'text_id': text_id
        }
        ret = TextDetail.create(detail_values)
        log.debug('class=TextInfoCreateHandler|create text detail ret=%s', ret)
        return success(data={})


class TextInfoListHandler(BaseHandler):

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

        info, num = TextInfo.page(**params)
        data['num'] = num
        if info:
            for item in info:
                text_id = item['id']
                item['id'] = str(item['id'])
                item['box_id'] = str(item['box_id'])
                icon_name = item['icon']
                item['icon'] = BASE_URL + icon_name
                item['icon_name'] = icon_name
                base_tools.trans_time(item, BoxList.DATETIME_KEY)
                detail = TextDetail.load_by_text_id(text_id)
                item['content'] = detail.data.get('content') if detail.data else ''
        data['info'] = info
        return success(data=data)


class TextInfoViewHandler(BaseHandler):

    _get_handler_fields = [
        Field('text_id', T_INT, False),
    ]

    _post_handler_fields = [
        Field('text_id', T_INT, False),
        Field('name', T_STR, False),
        Field('content', T_STR, True),
        Field('icon', T_STR, False),
        Field('available', T_INT, False),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _get_handler(self):
        params = self.validator.data
        text_id = params.get('text_id')

        text = TextInfo(text_id)
        text.load()
        if not text.data:
            return error(errcode=RESP_CODE.DATAERR)
        detail = TextDetail.load_by_text_id(text_id)
        text.data['content'] = detail.data.get('content') if detail.data else ''
        data = text.data
        icon_name = data['icon']
        data['icon'] = BASE_URL + icon_name
        data['icon_name'] = icon_name
        return success(data=data)

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        params = self.validator.data
        content = params.pop('content')
        text_id = params.pop('text_id')
        text = TextInfo(text_id)
        text.load()
        if not text.data:
            return error(errcode=RESP_CODE.DATAERR)
        ret = text.update(params)
        log.debug('TextInfoViewHandler|post update info ret=%s', ret)
        if ret != 1:
            return error(errcode=RESP_CODE.DATAERR)
        detail = TextDetail.load_by_text_id(text_id)
        detail_id = detail.data.get('id')
        detail_values = {
            'content': content
        }
        d = TextDetail(detail_id)
        ret = d.update(detail_values)
        log.debug('TextInfoViewHandler|post update detail ret=%s', ret)
        return success(data={})
