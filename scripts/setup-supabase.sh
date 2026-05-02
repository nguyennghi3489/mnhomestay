#!/bin/bash

# =============================================================================
# LocalStay Supabase Database Setup Script
# =============================================================================

set -e  # Exit on any error

echo "🏠 LocalStay - Supabase Database Setup"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the project root directory${NC}"
    exit 1
fi

if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Backend directory not found${NC}"
    exit 1
fi

echo -e "${BLUE}📂 Changing to backend directory...${NC}"
cd backend

# Check for environment variables
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please update DATABASE_URL in .env with your Supabase connection string${NC}"
    echo -e "${YELLOW}   Format: postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres${NC}"
    exit 1
fi

# Check if DATABASE_URL is configured
if grep -q "file:./dev.db" .env; then
    echo -e "${YELLOW}⚠️  Still using SQLite. Update DATABASE_URL in .env for Supabase${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 Generating Prisma client...${NC}"
npx prisma generate

echo -e "${BLUE}🗄️  Testing database connection...${NC}"
if npx prisma db pull --preview-feature > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo -e "${YELLOW}💡 Check your DATABASE_URL in .env file${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Creating database migration...${NC}"
npx prisma migrate dev --name init-supabase

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database migration completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

echo -e "${BLUE}🧪 Testing Prisma Studio...${NC}"
echo -e "${YELLOW}💡 Opening Prisma Studio - press Ctrl+C to close when done${NC}"
npx prisma studio

echo -e "${GREEN}🎉 Supabase setup completed successfully!${NC}"
echo -e "${BLUE}📊 Your database is ready at: https://app.supabase.com${NC}"
echo -e "${BLUE}🚀 Start the backend server: npm run start:dev${NC}"
