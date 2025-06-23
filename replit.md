# Asset Management System

## Overview

This is a full-stack asset management system built with React, Express, and TypeScript. The application provides comprehensive asset tracking, maintenance management, and reporting capabilities for enterprises. It features a modern UI with shadcn/ui components, server-side API with PostgreSQL database, and real-time data synchronization.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with consistent error handling
- **Development**: Hot reload with tsx for server-side development

### Database Schema
- **Assets Table**: Core asset information with unique asset IDs, categories, status tracking
- **Maintenance Records**: Scheduled and completed maintenance tracking
- **Audit Logs**: Complete audit trail for all asset changes
- **Relationships**: Foreign key constraints between assets and related records

## Key Components

### Core Modules
1. **Asset Management**: CRUD operations, search, filtering, bulk operations
2. **Maintenance Tracking**: Scheduled maintenance, completion tracking, cost management
3. **Audit System**: Comprehensive logging of all system changes
4. **Dashboard**: Real-time metrics and key performance indicators
5. **Reporting**: Analytics and business intelligence features

### UI Components
- **Layout System**: Responsive sidebar navigation with mobile sheet overlay
- **Data Tables**: Sortable, filterable tables with pagination
- **Modal System**: Consistent modal patterns for forms and details
- **Form Components**: Validated forms with error handling
- **Status Indicators**: Color-coded badges and icons for asset states

### API Endpoints
- `GET/POST /api/assets` - Asset CRUD operations
- `GET /api/assets/:id` - Individual asset details
- `GET /api/metrics` - Dashboard analytics
- `GET /api/maintenance` - Maintenance records
- `GET /api/audit-logs` - Audit trail access

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks
2. **API Layer**: Express routes handle validation and business logic
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Processing**: Structured JSON responses with error handling
5. **UI Updates**: Automatic cache invalidation and re-rendering

### State Management Flow
- Server state managed by TanStack Query with aggressive caching
- Form state handled by React Hook Form with Zod validation
- UI state managed by React hooks and context where needed
- Real-time updates through query invalidation patterns

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production deployments
- **Connection**: Environment variable `DATABASE_URL` required
- **Migrations**: Drizzle Kit for schema management

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Consistent icon system
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Date-fns**: Date formatting and manipulation

### Development Tools
- **Vite Plugins**: Runtime error overlay, Cartographer for Replit integration
- **TypeScript**: Strict type checking across frontend and backend
- **ESBuild**: Fast production bundling for server code

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both client and server
- **Hot Reload**: Vite for client, tsx for server-side changes
- **Database**: Automatic connection to Neon database via environment variables

### Production Deployment
- **Build Process**: Vite builds client assets, ESBuild bundles server
- **Server Configuration**: Express serves static files and API routes
- **Database Migrations**: `npm run db:push` applies schema changes
- **Environment**: Production mode with optimized bundles

### Replit Configuration
- **Modules**: Node.js 20, Web server, PostgreSQL 16
- **Ports**: Internal port 5000 mapped to external port 80
- **Deployment**: Autoscale deployment target with build/run scripts
- **Storage**: PostgreSQL provisioned automatically

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 23, 2025: Initial Enterprise Asset Management system setup
- June 23, 2025: Enhanced EAM with Work Order Management, Analytics Dashboard, and Maintenance Scheduling
  - Added comprehensive Work Order Management with status tracking and priority levels
  - Built Analytics & Reports page with cost trends, downtime analysis, and KPI metrics
  - Enhanced Maintenance Management with scheduling, overdue tracking, and frequency management
  - Integrated Recharts for professional data visualization
  - Added sample data across all modules for realistic testing
  - Implemented enterprise-grade navigation and responsive design
- June 23, 2025: Implemented PostgreSQL Database and Complete EAM Features
  - Converted from in-memory storage to PostgreSQL with Drizzle ORM
  - Added comprehensive database schema with relations for all EAM modules
  - Implemented Work Orders, Locations, Vendors, Service Contracts, Spare Parts management
  - Added Compliance Records tracking for regulatory requirements (ISO, OSHA, EPA, DOT)
  - Built Inventory Management with stock level monitoring and reorder alerts
  - Created Energy Consumption tracking for sustainability management
  - Added database seeding with realistic sample data across all modules
  - Implemented full CRUD operations with proper audit trails

## Changelog

- June 23, 2025: Initial setup and full EAM implementation