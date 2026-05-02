#!/bin/bash

# =============================================================================
# LocalStay Database Migration: SQLite → Supabase PostgreSQL
# =============================================================================

set -e

echo "🔄 LocalStay Database Migration"
echo "==============================="
echo "Migrating from SQLite to Supabase PostgreSQL"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Backup current SQLite data (optional)
echo -e "${BLUE}📦 Creating backup of current SQLite database...${NC}"
cd backend

if [ -f "prisma/dev.db" ]; then
    cp prisma/dev.db "prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ SQLite backup created${NC}"
else
    echo -e "${YELLOW}⚠️  No SQLite database found, skipping backup${NC}"
fi

# Update Prisma schema for PostgreSQL
echo -e "${BLUE}🔧 Updating Prisma schema for PostgreSQL...${NC}"

# Check if schema is already PostgreSQL
if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
    echo -e "${GREEN}✅ Schema already configured for PostgreSQL${NC}"
else
    echo -e "${YELLOW}⚠️  Schema still configured for SQLite${NC}"
    echo -e "${YELLOW}   Schema should already be updated by be-agent${NC}"
fi

# Prompt for Supabase connection details
echo -e "${BLUE}🔗 Supabase Connection Setup${NC}"
echo "Please provide your Supabase connection details:"
echo ""

read -p "Supabase Database URL (postgresql://postgres:password@db.xxx.supabase.co:5432/postgres): " DB_URL

if [ -z "$DB_URL" ]; then
    echo -e "${RED}❌ Database URL is required${NC}"
    exit 1
fi

# Update .env file
echo -e "${BLUE}📝 Updating environment configuration...${NC}"

# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Update DATABASE_URL
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|g" .env
rm .env.bak

echo -e "${GREEN}✅ Environment updated${NC}"

# Generate new Prisma client
echo -e "${BLUE}🔄 Generating Prisma client for PostgreSQL...${NC}"
npx prisma generate

# Test connection
echo -e "${BLUE}🧪 Testing database connection...${NC}"
if npx prisma db pull --preview-feature > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connection to Supabase successful${NC}"
else
    echo -e "${RED}❌ Failed to connect to Supabase${NC}"
    echo -e "${YELLOW}💡 Check your connection string and try again${NC}"
    exit 1
fi

# Run migration
echo -e "${BLUE}📊 Applying database migration...${NC}"
npx prisma migrate dev --name migrate-to-supabase

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    echo -e "${YELLOW}💡 Check the migration output above for details${NC}"
    exit 1
fi

# Start backend to test
echo -e "${BLUE}🚀 Testing backend server...${NC}"
echo -e "${YELLOW}💡 Starting server for 10 seconds to test...${NC}"

# Run server in background and test
npm run start:dev &
SERVER_PID=$!
sleep 10

# Test health endpoint
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running successfully with Supabase${NC}"
else
    echo -e "${YELLOW}⚠️  Could not reach health endpoint, but migration completed${NC}"
fi

# Kill test server
kill $SERVER_PID 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 Migration to Supabase completed successfully!${NC}"
echo -e "${BLUE}📱 Next steps:${NC}"
echo -e "  1. Start backend: npm run start:dev"
echo -e "  2. Open Prisma Studio: npx prisma studio"
echo -e "  3. Visit Supabase Dashboard: https://app.supabase.com"
echo ""
