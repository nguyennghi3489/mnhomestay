#!/bin/bash
echo "🧹 LocalStay MVP - Cleanup"

read -p "❓ Are you sure you want to remove all LocalStay containers and volumes? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Stopping and removing containers..."
    docker-compose down -v
    docker-compose -f docker-compose.prod.yml down -v 2>/dev/null
    
    echo "🗑️ Removing LocalStay Docker resources..."
    docker images --filter=reference='*localstay*' -q | xargs -r docker rmi -f
    docker volume ls --filter=name=localstay -q | xargs -r docker volume rm
    
    echo "✅ Cleanup complete!"
else
    echo "❌ Cleanup cancelled"
fi