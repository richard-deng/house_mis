# -*- coding: utf-8 -*-

import logging
import datetime
from constant import INVALID_VALUE
from house_base.define import TOKEN_HOUSE_CORE
from house_base.user import User
from house_base.profile import Profile
from zbase.base.dbpool import get_connection_exception

log = logging.getLogger()


def trans_datetime(date_value):
    date_str = datetime.datetime.strftime(date_value, '%Y-%m-%d %H:%M:%S')
    return date_str

def gen_now_str():
    now = datetime.datetime.now()
    now_str = now.strftime('%Y%m%d%H%M%S')
    return now_str

def get_merchant(user_id):
    func = 'get_merchant'
    log.debug('func=%s|user_id=%s', func, user_id)
    on = {'auth_user.id': 'profile.userid'}
    where = {'auth_user.id': user_id}
    keep_fields = [
        'auth_user.id', 'auth_user.mobile', 'auth_user.state', 'auth_user.email',
        'auth_user.is_active', 'profile.province', 'profile.city', 'profile.nickname',
        'profile.name', 'profile.idnumber',
    ]
    log.debug('yy')
    log.debug('token=%s', TOKEN_HOUSE_CORE)
    with get_connection_exception(TOKEN_HOUSE_CORE) as conn:
        log.debug('xx')
        ret = conn.select_join_one(table1='auth_user', table2='profile', fields=keep_fields, on=on, where=where)
        log.debug('func=%s|user_id=%s|ret=%s', func, user_id, ret)
        return ret

def update_merchant(user_id, values):
    func = 'update_merchant'
    log.debug('func=%s|user_id=%s|values=%s', func, user_id, values)

    user_value = {}
    profile_value = {}

    for key, value in values.iteritems():
        if value not in INVALID_VALUE:
            if key in User.KEYS:
                user_value[key] = value
            if key in Profile.KEYS:
                profile_value[key] = value
        else:
            log.debug('ingore key=%s', key)

    log.debug('user_value=%s|profile_value=%s', user_value, profile_value)
    if user_value:
        user = User(user_id)
        user.update(user_value)

    if profile_value:
        profile = Profile(user_id)
        profile.update(profile_value)
