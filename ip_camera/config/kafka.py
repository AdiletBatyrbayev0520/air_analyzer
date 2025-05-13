from kafka import KafkaProducer, KafkaConsumer
import numpy as np
import time
import json
def create_producer():
    producer = KafkaProducer(bootstrap_servers='kafka:9092', 
                             value_serializer=lambda v: str(v).encode('utf-8'))
    return producer

def create_consumer():
    consumer = KafkaConsumer('people_count', 
                             bootstrap_servers='kafka:9092',    
                             auto_offset_reset='earliest', 
                             enable_auto_commit=True,  
                             group_id='camera-consumer-1',)
    return consumer

