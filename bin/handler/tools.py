# -*- coding: utf-8 -*-

import logging
import datetime

log = logging.getLogger()


def trans_datetime(date_value):
    date_str = datetime.datetime.strftime(date_value, '%Y-%m-%d %H:%M:%S')
    return date_str
