# coding: utf-8
import logging

from config import cookie_conf
from runtime import g_rt
from house_base.base_handler import BaseHandler
from house_base.box_list import BoxList
from house_base.order import Order
from house_base.response import success, error, RESP_CODE
from house_base.session import house_check_session

from zbase.web.validator import (
    with_validator_self, Field, T_INT, T_STR
)

log = logging.getLogger()


class OrderCreateHandler(BaseHandler):

    _post_handler_fields = [
        Field('box_id', T_INT, False),
        Field('goods_name', T_STR, False),
        Field('goods_price', T_INT, False),
        Field('goods_desc', T_STR, False),
        Field('goods_picture', T_STR, False),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        params = self.validator.data
        box_id = params.get('box_id')
        box = BoxList(box_id)
        box.load()
        if not box.data:
            return error(errcode=RESP_CODE.DATAERR)
        # 检查名称
        # 只能创建一个先检查
        order = Order.load_by_box_id(box_id)
        if order.data:
            return error(error=RESP_CODE.DATAEXIST)
        ret = Order.create(params)
        log.debug('class=OrderCreateHandler|create ret=%s', ret)
        if ret != 1:
            return error(errcode=RESP_CODE.DATAERR)
        return success(data={})