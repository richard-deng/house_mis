# -*- coding: utf-8 -*-
import os
HOME = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'bin')
rtenv = 'product'

LOGFILE = {
    'root': {
        'filename': {
            'DEBUG': os.path.join(HOME, '../log/house_mis.log'),
            'ERROR': os.path.join(HOME, '../log/house_mis.error.log'),
        }
    }
}
LOGFILE = None

database = {
    'house_core':{
        'engine': 'pymysql',
        'passwd': '',
        'charset': 'utf8',
        'db': 'house_core',
        'idle_timeout': 10,
        'host': '127.0.0.1',
        'user': 'root',
        'port': 3306,
        'conn': 3
    },

}



# web config
# URLS配置
URLS = None
# 静态路径配置
STATICS = {'/mis/static/':'/static/'}
# 模板配置
TEMPLATE = {
    'cache': True,
    'path': '',
    'tmp': os.path.join(HOME, '../tmp'),
}
# 中间件
MIDDLEWARE = ()
# WEB根路径
DOCUMENT_ROOT = HOME
# 页面编码
CHARSET = 'UTF-8'
# APP就是一个子目录
APPS = ()
DATABASE = {}
# 调试模式: True/False
# 生产环境必须为False
DEBUG = True
# 模版路径
template = os.path.join(HOME, 'template')

# 服务地址
HOST = '0.0.0.0'
# 服务端口
PORT = 8083
#redis
redis_url = 'redis://127.0.0.1:6379/0'
#用户注册状态
REGISTER_STATE = 2
#注册激活
DEFAULT_ACTIVE = 1
# 终端绑定默认2
TERMBIND_STATE = 2
#允许登录的手机号
ALLOW_LOGIN_MOBILE = ['13802438716']
#cookie 配置
# cookie_conf = { 'expires':60*60*24*3, 'max_age':60*60*24*3, 'domain':'192.168.0.103', 'path':'/posp'}
cookie_conf = { 'expires':60*60*24*3, 'max_age':60*60*24*3, 'domain':'127.0.0.1', 'path':'/mis'}
# 上传的文件存放位置
SAVE_PATH = '/Users/admin/Documents/develop/myproject/house/house_mis/bin/static/upload/icon/'
# 链接前缀
BASE_URL = 'http://' + cookie_conf.get('domain') + ':' + str(PORT) + '/mis/static/upload/icon/'