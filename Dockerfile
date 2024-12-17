FROM mongo:4.4.7

# Add replica set initiation script
RUN echo "rs.initiate();" > /docker-entrypoint-initdb.d/replica-init.js

# Expose MongoDB default port
EXPOSE 27017

# Pass the replication configuration to the MongoDB default entrypoint
CMD ["--replSet", "rs", "--bind_ip_all"]