#!/bin/bash

# BiteMe Production Deployment Script
set -e

echo "🚀 Starting BiteMe Production Deployment..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check for environment file
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production file not found!"
    echo "📝 Creating .env.production from template..."
    cp .env.production.example .env.production
    echo "✅ Please edit .env.production with your actual values before running this script again."
    exit 1
fi

echo "🔧 Initializing database indexes..."
cd backend
node db/initializeDb.js
cd ..

echo "🧹 Cleaning up old containers..."
docker-compose down -v --remove-orphans

echo "🏗️  Building production images..."
docker-compose --env-file .env.production build --no-cache

echo "🚀 Starting production services..."
docker-compose --env-file .env.production up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🔍 Checking service health..."
services=("backend" "admin" "frontend" "admin-frontend" "mongodb" "redis")

for service in "${services[@]}"; do
    if docker-compose ps "$service" | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running properly"
        docker-compose logs "$service"
    fi
done

echo "📊 Service status:"
docker-compose ps

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📱 Access your applications:"
echo "   Customer App: http://localhost"
echo "   Admin Panel:  http://localhost:8080"
echo "   API Health:   http://localhost:3000/health"
echo "   Admin API:    http://localhost:8000"
echo ""
echo "📝 To view logs: docker-compose logs -f [service-name]"
echo "🛑 To stop:      docker-compose down"
echo "🔄 To restart:   docker-compose restart [service-name]"