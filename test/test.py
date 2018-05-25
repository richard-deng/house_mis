# coding: utf-8
import json
import hashlib
import unittest
from zbase.base import logger
from zbase.base.http_client import RequestsClient
from zbase.server.client import HttpClient

log = logger.install('stdout')


class TestHouseMisInstrument(unittest.TestCase):
    def setUp(self):
        self.url = ''
        self.send = {'se_userid': 1}
        self.host = '127.0.0.1'
        self.port = 8083
        self.timeout = 2000

        self.headers = {'sessionid': '8b71a4df-ca0c-4037-bdf9-a03d77fe7666'}
        self.cookie = self.headers
        self.server = [
            {
                'addr': (self.host, self.port),
                'timeout': self.timeout
            }
        ]
        self.client = HttpClient(self.server, client_class=RequestsClient)

    @unittest.skip("skipping")
    def test_login(self):
        self.url = '/mis/v1/api/login'
        self.send = {
            'mobile': 13802438716,
            'password': hashlib.md5('123456').hexdigest()
        }
        ret = self.client.post(self.url, self.send)
        log.info(ret)
        log.info('%s', self.client.client.headers)
        respcd = json.loads(ret).get('respcd')
        self.assertEqual(respcd, '0000')

    @unittest.skip("skipping")
    def test_user_list(self):
        self.url = '/mis/v1/api/user/list'
        self.send.update({
            'page': 1,
            'maxnum': 10
        })
        ret = self.client.get(self.url, self.send, cookies=self.cookie)
        log.info(ret)
        respcd = json.loads(ret).get('respcd')
        self.assertEqual(respcd, '0000')

    @unittest.skip("skipping")
    def test_user_view(self):
        self.url = '/mis/v1/api/user/view'
        self.send.update({
            'user_id': 1,
        })
        ret = self.client.get(self.url, self.send, cookies=self.cookie)
        log.info(ret)
        respcd = json.loads(ret).get('respcd')
        self.assertEqual(respcd, '0000')

    @unittest.skip("skipping")
    def test_user_update(self):
        self.url = '/mis/v1/api/user/view'
        self.send.update({
            'user_id': 1,
            'name': 'ddddd'
        })
        ret = self.client.post(self.url, self.send, cookies=self.cookie)
        log.info(ret)
        respcd = json.loads(ret).get('respcd')
        self.assertEqual(respcd, '0000')

    # @unittest.skip("skipping")
    def test_user_create(self):
        self.url = '/mis/v1/api/user/create'
        self.send.update({
            'mobile': '13802438717',
            'email': 'richard.deng@live.com',
            'name': 'richard.deng',
            'idnumber': '511321198707129249',
            'province': '四川省',
            'city': '成都市',
        })
        ret = self.client.post(self.url, self.send, cookies=self.cookie)
        log.info(ret)
        respcd = json.loads(ret).get('respcd')
        self.assertEqual(respcd, '0000')



suite = unittest.TestLoader().loadTestsFromTestCase(TestHouseMisInstrument)
unittest.TextTestRunner(verbosity=2).run(suite)
