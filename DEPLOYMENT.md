# SRIJAN Deployment Guide

This guide covers deployment options and best practices for the SRIJAN e-commerce frontend.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend API is running and accessible
- [ ] Images are optimized
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All features tested in production mode (`npm run start`)
- [ ] SEO meta tags verified
- [ ] Analytics configured (if using)

---

## 🚀 Vercel (Recommended)

### Why Vercel?
- Zero configuration for Next.js
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs
- Built-in analytics

### Steps

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Deploy via CLI**
```bash
vercel
# Follow prompts for first deployment

# For production deployment
vercel --prod
```

3. **Or via GitHub Integration**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add the following:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_ADMIN_API_KEY=your-admin-key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=srijan-products
```

---

## 🌐 Netlify

### Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: (leave empty)

3. **Add Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Add all env vars from `.env.example`

4. **Deploy**
   - Netlify will automatically build and deploy

### netlify.toml

Create a `netlify.toml` in the root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## ☁️ AWS Amplify

### Steps

1. **Connect Repository**
   - Open AWS Amplify Console
   - Connect GitHub/GitLab/Bitbucket

2. **Build Settings**
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Environment Variables**
   - Add in Amplify Console → Environment Variables

4. **Deploy**

### amplify.yml

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_ADMIN_API_KEY=${NEXT_PUBLIC_ADMIN_API_KEY}
    env_file:
      - .env.local
```

### Build and Run

```bash
# Build image
docker build -t srijan-frontend .

# Run container
docker run -p 3000:3000 --env-file .env.local srijan-frontend

# Or with docker-compose
docker-compose up
```

---

## 🖥️ Self-Hosted (VPS/Server)

### Requirements
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

### Steps

1. **Clone Repository**
```bash
git clone https://github.com/your-repo/srijan-frontend.git
cd srijan-frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create .env.local**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Build**
```bash
npm run build
```

5. **Install PM2**
```bash
npm install -g pm2
```

6. **Create ecosystem.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'srijan-frontend',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

7. **Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

8. **Configure Nginx**

Create `/etc/nginx/sites-available/srijan`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/srijan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🧪 Testing Before Deployment

### 1. Build Locally
```bash
npm run build
npm run start
```
Test on http://localhost:3000

### 2. Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```
Target: 90+ for all categories

### 3. Check TypeScript
```bash
npm run type-check
```

### 4. Check Bundle Size
```bash
npm run build
```
Review `.next/analyze/` output (if analyzer configured)

---

## 📊 Post-Deployment

### 1. Monitor Performance
- Set up error tracking (Sentry, LogRocket)
- Configure analytics (Google Analytics, Vercel Analytics)
- Monitor server metrics

### 2. Set Up Monitoring
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

### 3. Configure CDN
- Ensure static assets are cached
- Configure image optimization
- Enable compression

### 4. Security Headers

Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

---

## 🔒 Environment Variables Security

### Never Commit
- API keys
- Secret tokens
- Database credentials

### Use Secrets Management
- Vercel: Project Settings → Environment Variables
- AWS: AWS Secrets Manager or Parameter Store
- Self-hosted: Use `.env.local` (gitignored)

### Prefix Public Vars
Only vars prefixed with `NEXT_PUBLIC_` are exposed to browser:
```bash
NEXT_PUBLIC_API_URL=https://api.example.com  # Exposed
API_SECRET_KEY=secret123                      # Server-only
```

---

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Test API endpoints manually

### Images Not Loading
- Check image domains in `next.config.js`
- Verify image URLs are accessible
- Check S3/CDN permissions

### Slow Performance
- Enable Next.js caching
- Optimize images (WebP, AVIF)
- Use CDN for static assets
- Enable compression

---

## 📞 Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Open GitHub issue
- Contact support@srijan.in

---

<div align="center">
  <p><strong>Deploy with confidence! 🚀</strong></p>
</div>

