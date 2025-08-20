#!/bin/bash

# Enamel Georgia Database Setup Script
# This script helps set up PostgreSQL for development

echo "🗄️ Enamel Georgia Database Setup"
echo "================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Installing via Homebrew..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    brew install postgresql@15
    brew services start postgresql@15
else
    echo "✅ PostgreSQL found"
fi

# Create database and user
echo "📋 Setting up database..."

# Create user if not exists
psql -d postgres -c "CREATE USER enamel_user WITH PASSWORD 'enamel_dev_password_2025';" 2>/dev/null || echo "User already exists"

# Create database if not exists
psql -d postgres -c "CREATE DATABASE enamel_georgia OWNER enamel_user;" 2>/dev/null || echo "Database already exists"

# Grant privileges
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE enamel_georgia TO enamel_user;"

# Test connection
echo "🔌 Testing database connection..."
if psql -U enamel_user -d enamel_georgia -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
    echo ""
    echo "📝 Database Details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: enamel_georgia"
    echo "   User: enamel_user"
    echo ""
    echo "🚀 Ready for Prisma migrations!"
    echo "   Run: npm run db:migrate"
else
    echo "❌ Database connection failed"
    echo "Please check PostgreSQL installation and try again"
    exit 1
fi