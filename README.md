# kafka-flow
Structured Kafka messaging with pluggable protocols (Avro, BSON, JSON).

docker run \
  -d \
  --name=kafka \
  --restart=always \
  -p 2181:2181 \
  -p 9092:9092 \
  --env _KAFKA_advertised_host_name=localhost \
  --env _KAFKA_advertised_port=9092 \
  --env _KAFKA_auto_create_topics_enable=true \
  flozano/kafka
