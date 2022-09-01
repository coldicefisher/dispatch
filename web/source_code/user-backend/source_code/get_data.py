from kp_fraydit.producers.auto_producer import AutoProducer
from kp_fraydit.schema.fields import Fields, Field

import psycopg2

# Basic function for creating connection
def postgres_conn(auto_commit = False):
    """ Connect to the PostgreSQL database server """
    conn = None
    # connect to the PostgreSQL server
    #print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(
        host='10.100.100.8',
        database='django_trader', 
        user='postgres', 
        password='postgres',
        port='5432'
    )

    return conn


prod = AutoProducer('iex_stock_data')
prod.preserve_order = True
prod.current_key_schema.validate(
                                    validation_schema_source='https://fraydit.com/static/schemas/price_data_key.avro'
                                )

prod.current_value_schema.validate(
                                    validation_schema_source='https://fraydit.com/static/schemas/price_data_value.avro',
                                    additional_fields=Fields([
                                                                Field('dividends', ['null', 'double']),
                                                                Field('stock_splits', ['null', 'double']),
                                                                Field('market_average', ['null', 'double']),
                                                                Field('market_notional', ['null', 'double']),
                                                                Field('market_change_over_time', ['null', 'double']),
                                                                Field('notional', ['null', 'double']),
                                                                Field('adjusted_close', ['null', 'double']),
                                                                Field('average', ['null', 'double']),
                                                                Field('market_open', ['null', 'double']),
                                                                Field('market_high', ['null', 'double']),
                                                                Field('market_low', ['null', 'double']),
                                                                Field('market_close', ['null', 'double']),
                                                                Field('market_number_of_trades', ['null', 'double']),
                                                                Field('market_volume', ['null', 'double']),
                                                                
                                                            ])
                                    )

with postgres_conn() as conn:
    with conn.cursor() as cursor:
        select_str = '''SELECT symbol, ticker_datetime, open, high, low, close, volume, dividends, stock_splits, market_average, 
        market_notional, market_change_over_time, notional, adjusted_close, average, market_open, market_high,
        market_low, market_close, market_number_of_trades, market_volume 
        FROM tickerdata_tick'''
        
        cursor.execute(select_str)
        data = cursor.fetchall()
        #print (data)
        for row in data:
            prod.addValueArgs(dividends=row.get('dividends'), stock_splits=row.get('stock_splits'), market_average=row.get('market_average'),
                                market_notional=row.get('market_notional'), market_change_over_time=row.get('market_change_over_time'), 
                                notional=row.get('notional'), adjusted_close=row.get('adjusted_close'), average=row.get('average'), 
                                market_open=row.get('market_open'), market_high=row.get('market_high'), 
                                market_low=row.get('market_low'), market_close=row.get('market_close'), 
                                market_number_of_trades=row.get('market_number_of_trades'), market_volume=row.get('market_volume'),
                            )

            prod.addValueArgs(timestamp=row['ticker_datetime'], open=row['open'], high=row['high'], low=row['low'], 
                                close=row['close'], volume=row['volume']
                            )
            
        