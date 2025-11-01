# Stage 1: Base build stage
FROM python:3.12-slim AS builder
ENV TZ=Europe/Moscow

RUN apt-get update -y && apt-get install -y tzdata
# Create the app directory
RUN mkdir /app

# Set the working directory
WORKDIR /app

# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Upgrade pip and install dependencies
RUN pip install --upgrade pip

# Copy the requirements file first (better caching)
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# pg_dump -U postgres -d original_db -F c -f /path/to/backup.dump
# Stage 2: Production stage
FROM python:3.12-slim

RUN useradd -m -r drop_zone_admin && \
    mkdir /app && \
    chown -R drop_zone_admin /app

# Copy the Python dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Set the working directory
WORKDIR /app

# Copy application code
COPY --chown=drop_zone_admin:drop_zone_admin . .

# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY --chmod=755 entrypoint.sh /entrypoint.sh
RUN mkdir -p /app/staticfiles && chown -R drop_zone_admin:drop_zone_admin /app/staticfiles
# Switch to non-root user
USER drop_zone_admin

# Expose the application port
EXPOSE 8000

# Start the application using Gunicorn


CMD ["/entrypoint.sh"]
