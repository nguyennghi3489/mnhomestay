#!/bin/bash
echo "🏠 LocalStay MVP - Status Check"
echo ""

if [ -f docker-compose.prod.yml ] && [ "$(docker-compose -f docker-compose.prod.yml ps -q)" ]; then
    echo "📊 Production Services:"
    docker-compose -f docker-compose.prod.yml ps
elif [ "$(docker-compose ps -q)" ]; then
    echo "📊 Development Services:"
    docker-compose ps
else
    echo "⚠️  No LocalStay services are running"
    echo "💡 Run './setup-dev.sh' to start development environment"
fi

echo ""
echo "🐳 Docker System Info:"
echo "  Images: $(docker images --filter=reference='*localstay*' --format 'table {{.Repository}}:{{.Tag}}	{{.Size}}' | wc -l | tr -d ' ') LocalStay images"
echo "  Containers: $(docker ps -a --filter=name=localstay --format 'table {{.Names}}	{{.Status}}' | wc -l | tr -d ' ') LocalStay containers"
echo "  Volumes: $(docker volume ls --filter=name=localstay --format 'table {{.Name}}' | wc -l | tr -d ' ') LocalStay volumes"