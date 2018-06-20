# coding: utf-8
import logging
import json

from config import cookie_conf
from runtime import g_rt

from house_base.base_handler import BaseHandler
from house_base.questions import Questions
from house_base.response import success, error, RESP_CODE
from house_base.session import house_check_session
import tools

from zbase.web.validator import (
    with_validator_self, Field, T_INT, T_STR
)

log = logging.getLogger()


class QuestionsListHandler(BaseHandler):

    _get_handler_fields = []
    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _get_handler(self):
        ret = []
        data = Questions.load_all()
        ret.extend(data)
        return json.dumps(ret)

class QuestionAddHandler(BaseHandler):

    _post_handler_fields = [
        Field('name', T_STR, False),
        Field('category', T_STR, False),
        Field('parent', T_INT, False),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        data = {}
        params = self.validator.data
        params.update({
            'utime': tools.gen_now_str(),
            'ctime': tools.gen_now_str(),
        })
        ret = Questions.create(params)
        return success(data=data)


class QuestionUpdateHandler(BaseHandler):

    _post_handler_fields = [
        Field('name', T_STR, True),
        Field('status', T_INT, True),
        Field('question_id', T_INT, False),
    ]

    @house_check_session(g_rt.redis_pool, cookie_conf)
    @with_validator_self
    def _post_handler(self):
        data = {}
        values = {}
        params = self.validator.data
        question_id = params.pop('question_id')
        status = params.pop('status')
        name = params.pop('name')
        if status:
            values['status'] = status
        if name:
            values['name'] = name
        values['utime'] = tools.gen_now_str()
        question = Questions(question_id)
        ret = question.update(values)
        return success(data=data)
