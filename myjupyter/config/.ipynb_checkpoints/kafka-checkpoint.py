from kafka import KafkaProducer, KafkaConsumer

def create_producer():
    print("Creating producer")
    producer = KafkaProducer(bootstrap_servers='10.36.40.79:9094', 
                             value_serializer=lambda v: str(v).encode('utf-8'))
    print(producer)
    print("Producer created")
    return producer

def create_consumer():
    print("Creating consumer")
    consumer = KafkaConsumer('people_count', 
                             bootstrap_servers='10.36.40.79:9094',    
                             auto_offset_reset='earliest', 
                             enable_auto_commit=True,  
                             group_id='camera-consumer-1',)
    print("Consumer created")
    return consumer

