import logging
import os
import sys
import datetime
import inspect

from kp_fraydit.datetime_functions import today_as_string
from kp_fraydit.root import root_dir

from kp_fraydit.producers.auto_producer import AutoProducer
from kp_fraydit.admin.admin_engine import AdminEngine

from asgiref.sync import sync_to_async, async_to_sync
import asyncio

# setup the logger
logger = logging.getLogger(__name__)


# file_handler = logging.FileHandler(f'{root_dir}/logs/errors_{today_as_string()}.log')
logging.Handler()
formatter    = logging.Formatter('%(asctime)s : %(levelname)s : %(name)s : %(message)s')
# file_handler.setFormatter(formatter)

# add file handler to logger
# logger.addHandler(file_handler)

# Set logger level to error
logger.setLevel(logging.INFO)


class KafkaLoggingHandler(logging.Handler):

    def __init__(self):
        logging.Handler.__init__(self)
        self.setFormatter(formatter)
        # Check to see if there is a kafka topic already and it is formatted correctly
        self.producer = AutoProducer(topic_name='programLogs', include_value_fields=[ 'message',], include_key_fields=['level',], preserve_order=False)
        
        
    def emit(self, record):
        #drop kafka logging to avoid infinite recursion
        if record.name == 'kafka':
            return
        try:
            #use default formatting
            msg = self.format(record)
            #produce message
            self.producer.addValueArgs(message=msg)
            self.producer.addKeyArgs(level=self.level)
        except Exception as e:
            import traceback
            ei = sys.exc_info()
            traceback.print_exception(ei[0], ei[1], ei[2], None, sys.stderr)
            del ei


def handleErrors(func):

    kh = KafkaLoggingHandler()
    kh.setLevel(logging.ERROR)
    # setup the logger
    logger = logging.getLogger(func.__name__)
    logger.addHandler(kh)

    if not inspect.isawaitable(func):
        def inner(*args, **kwargs):
            try:
                results = func(*args, **kwargs)
                return results
            except Exception as e:
                logger.error(e)
                raise
        
    else:
        def inner(*args, **kwargs): return func(*args, **kwargs)
    
    
    return inner