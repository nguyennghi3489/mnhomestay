#!/bin/bash
echo "🚀 LocalStay MVP - Production Deployment"

# Check for required environment file
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "📝 Copy env/.env.production to .env and configure your settings"
    exit 1
fi

# Check required environment variables
source .env
required_vars=("DATABASE_URL" "JWT_SECRET" "FRONTEND_URL")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

# Stop existing containers
echo "🔄 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and deploy
echo "🔨 Building and deploying..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ LocalStay production deployment complete!"
echo "🌐 Your application should be available soon"
echo ""
echo "📋 To check status: docker-compose -f docker-compose.prod.yml ps"
echo "📋 To view logs: docker-compose -f docker-compose.prod.yml logs -f"