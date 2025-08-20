# Database Setup Guide

This guide will help you set up PostgreSQL for the Enamel Georgia backend.

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 12+ (or Docker)

## 🚀 Quick Setup

### Option 1: Local PostgreSQL (Recommended for macOS)

1. **Install PostgreSQL via Homebrew:**
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Run the setup script:**
   ```bash
   npm run db:setup
   ```

3. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

4. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed the database:**
   ```bash
   npm run db:seed
   ```

### Option 2: Docker (Alternative)

1. **Start PostgreSQL container:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d postgres
   ```

2. **Continue with steps 3-5 from Option 1**

## 🧪 Testing

Test your database connection:
```bash
npm run db:test
```

## 📊 Database Management

### Available Commands

```bash
npm run db:setup      # Setup PostgreSQL database and user
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:seed       # Populate with 217 enamel products
npm run db:reset      # Reset database (WARNING: deletes all data)
npm run db:studio     # Open Prisma Studio (GUI)
npm run db:test       # Test database connection
```

### Prisma Studio

View and edit your database with a web GUI:
```bash
npm run db:studio
```
Opens at: http://localhost:5555

## 🗄️ Database Schema

### Core Tables

- **products** - 217 enamel colors with specifications
- **users** - Customer and admin accounts
- **orders** - Order management
- **order_items** - Individual items in orders
- **carts** - Shopping cart sessions
- **cart_items** - Items in shopping carts
- **addresses** - Shipping/billing addresses
- **settings** - System configuration

### Sample Data

After seeding, you'll have:
- **217 enamel products** (matching your frontend)
- **Admin user**: admin@enamelgeorgia.com (password: admin123)
- **Test customer**: customer@example.com (password: admin123)
- **System settings** for e-commerce configuration

## 🔧 Configuration

### Environment Variables

Make sure these are set in `.env`:

```env
DATABASE_URL="postgresql://enamel_user:enamel_dev_password_2025@localhost:5432/enamel_georgia?schema=public"
```

### Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: enamel_georgia
- **User**: enamel_user
- **Password**: enamel_dev_password_2025

## 🐛 Troubleshooting

### PostgreSQL not found
```bash
# Install via Homebrew
brew install postgresql@15
brew services start postgresql@15
```

### Permission denied
```bash
# Reset PostgreSQL permissions
sudo -u postgres psql
```

### Connection refused
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
```

### Migration fails
```bash
# Reset and try again
npm run db:reset
npm run db:migrate
```

### Port already in use
```bash
# Find and kill process using port 5432
lsof -ti:5432 | xargs kill -9
```

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for credentials
- Enable SSL for production databases
- Regular backups are recommended

## 📈 Production Setup

For production deployment:

1. Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
2. Update `DATABASE_URL` with production credentials
3. Run migrations: `npm run db:deploy`
4. Seed production data as needed

---

**Status**: Phase 1.2 Database Setup Complete
**Next**: Phase 1.3 API Endpoints for product management