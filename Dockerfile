# Simple, lightweight container deployment for SahiPRD
FROM python:3.11-slim

WORKDIR /app

# Copy application files
COPY . /app

# Expose default HTTP port
EXPOSE 8080

# Run the SahiPRD server
CMD ["python3", "server.py", "8080"]
