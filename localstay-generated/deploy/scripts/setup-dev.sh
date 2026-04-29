#!/bin/bash
echo "🏠 LocalStay MVP - Development Setup"

# Check dependencies
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose required but not installed. Aborting." >&2; exit 1; }

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    cp env/.env.development .env
    echo "✅ Created .env file from development template"
    echo "📝 You can customize the settings in .env"
fi

# Start services
echo "🚀 Starting LocalStay services..."
docker-compose down
docker-compose pull
docker-compose up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker-compose exec -T db pg_isready -U localstay; do
    echo "   Database still starting..."
    sleep 2
done

# Run database migrations (if you have them)
echo "🗄️ Running database setup..."
# docker-compose exec -T backend npm run db:migrate
# docker-compose exec -T backend npm run db:seed

echo ""
echo "✅ LocalStay development environment is ready!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:3000"
echo "🗄️ Database: localhost:5432 (user: localstay, db: localstay)"
echo "⚡ Redis: localhost:6379"

echo ""
echo "📋 Useful commands:"
echo "  docker-compose logs -f        # View logs"
echo "  docker-compose down           # Stop services"
echo "  docker-compose restart        # Restart services"
echo "  docker-compose exec backend sh  # Access backend container"