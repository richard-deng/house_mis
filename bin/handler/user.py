# coding: utf-8

import tools
import logging
import traceback

from runtime import g_rt
from config import cookie_conf
from house_base.base_handler import BaseHandler
from house_base.user import User
from constant import INVALID_VALUE
from zbase.base.dbpool import with_database
from house_base.response import error, success, RESP_CODE
from house_base.session import house_check_session
from house_base.define import (HOUSE_USER_STATE_MAP, TOKEN_HOUSE_CORE)
from zbase.web.validator import (
    with_validator_self, Field, T_INT, T_STR
)

log = logging.getLogger()


class UserListHandler(BaseHandler):

    _get_handler_fields = [
        Field('page', T_INT, False),
        Field('maxnum', T_INT, False),
        Field('mobile', T_STR, True),
        Field('user_id', T_STR, True),
    ]

    @with_database(TOKEN_HOUSE_CORE)
    def _query_handler(self, page, page_size, mobile=None, user_id=None):
        where = {}
        other = ''
        on = {'auth_user.id': 'profile.userid'}
        if mobile not in INVALID_VALUE:
            where['auth_user.mobile'] = mobile

        if user_id not in INVALID_VALUE:
            where['auth_user.id'] = user_id

        keep_fields = [
            'auth_user.id', 'auth_user.state', 'auth_user.mobile',
            'auth_user.date_joined','profile.nickname', 'profile.name',
            'profile.idnumber',
        ]
        sql = self.db.select_join_sql(
            table1='auth_user',
            table2='profile',
            on=on,
            fields=keep_fields,
            where=where,
            other=other,
        )
        pager = self.db.select_page(sql, pagecur=page, pagesize=page_size)
        pager.split()
        return pager.pagedata.data, pager.count

    def _translate(self, data):
        for item in data:
            if item.get('date_joined'):
                item['date_joined'] = tools.trans_datetime(item['date_joined'])
            item['state_desc'] = HOUSE_USER_STATE_MAP.get(item['state'], '')
        return data

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _get_handler(self):
        data = {}
        params = self.validator.data
        curr_page = params.get('page')
        max_page_num = params.get('maxnum')
        mobile = params.get('mobile')
        user_id = params.get('user_id')
        info, num = self._query_handler(
            page=curr_page, page_size=max_page_num,
            mobile=mobile, user_id=user_id
        )
        if info:
            info = self._translate(info)
        data['info'] = info
        data['num'] = num
        return success(data=data)


class UserViewHandler(BaseHandler):

    _get_handler_fields = [
        Field('user_id', T_INT, False),
    ]

    _post_handler_fields = [
        Field('user_id', T_INT, False),
        Field('mobile', T_STR, True),
        Field('email', T_STR, True),
        Field('name', T_STR, True),
        Field('idnumber', T_STR, True),
        Field('province', T_STR, True),
        Field('city', T_STR, True),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _get_handler(self):
        try:
            params = self.validator.data
            user_id = params.get('user_id')
            data = tools.get_merchant(user_id)
            return success(data=data)
        except Exception:
            log.warn(traceback.format_exc())
            return error(RESP_CODE.SERVERERR)

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        try:
            params = self.validator.data
            user_id = params.pop('user_id')
            values = params
            tools.update_merchant(user_id, values)
            return success(data={})
        except Exception:
            log.warn(traceback.format_exc())
            return error(RESP_CODE.SERVERERR)


class UserCreateHandler(BaseHandler):

    _post_handler_fields = [
        Field('mobile', T_STR, False),
        Field('email', T_STR, False),
        Field('name', T_STR, False),
        Field('idnumber', T_STR, True),
        Field('province', T_STR, True),
        Field('city', T_STR, True),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        params = self.validator.data

        # 是否已经注册
        mobile = params.get('mobile')
        user = User.load_user_by_mobile(mobile)
        if user.data:
            return error(RESP_CODE.DATAEXIST, resperr='手机号已存在')
        # 默认用用户名称和手机号一样
        params['username'] = params['mobile']
        params['nickname'] = params['name']
        flag, userid = tools.create_merchant(params)
        if flag:
            return success(data={'userid': userid})

        return error(RESP_CODE.DATAERR)
