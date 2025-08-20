-- Initialize Enamel Georgia Database
-- This script runs when the PostgreSQL container starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional indexes for performance
-- These will be created after Prisma migrations

-- Set timezone to Georgia
SET timezone = 'Asia/Tbilisi';

-- Basic database settings for e-commerce performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_functions = all;