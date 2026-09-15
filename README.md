# AEGIS
Aegis is the poweful backend API for dpskmun.com. It's our school platforms that is powering our School's MUN events from registeration to committee to organizing team managemnet

## Tech Stack
Built with Elysia on the Bun runtime to make it fast, with using of postgreSQL via Prisma and cache with Redis.

## Features
- **JWT AUTH** - support JWT access + refresh token with tracking and connected to each other to make it secure
- **Role base access** - it support role base access to the api
- **API versioning** - there are different version v0 for production v1 for testing v2 for development
- **Committee Management** - support committee management will add support of attendance and other thing in future

## Getting Started
### Prerequisites
- Bun installed
- a postgressSQL database
- a redis instance
### Installation 
```
git clone https://github.com/CodingWithHardik/aegis.git
cd aegis
bun install
```

**Environment Variables**
Copy `.env.example` to `.env` all fill values:
```
PORT=
FRONTEND_URL=
HOSTNAME=
DATABASE_URL=
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
GLOBAL_RATE_LIMIT_WINDOW=
GLOBAL_RATE_LIMIT_SIZE=
LOGIN_RATE_LIMIT_WINDOW=
LOGIN_RATE_LIMIT_SIZE=
SALT_ROUNDS=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
```

**Database Setup**
```
bunx --bun prisma migrate deploy
bunx --bun prisma generate
```
### Running 
```
bun run dev
bun run prod
```
Server Address will be `http://localhost:3000/`