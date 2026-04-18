# Deployment Guide - Qatar Paint Platform

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Cloudflare Resources

#### Create D1 Database
```bash
# Create the database
wrangler d1 create qatarpaint-db

# Copy the database ID from the output
# Update wrangler.toml with your database_id
```

#### Create R2 Bucket
```bash
wrangler r2 bucket create qatarpaint-assets
```

### 3. Run Database Migrations
```bash
wrangler d1 execute qatarpaint-db --file=database/schema.sql
```

### 4. Local Development
```bash
npm run dev
```
Visit: http://localhost:8787

### 5. Deploy to Production
```bash
npm run deploy
```

---

## Environment Configuration

### Development (.dev.vars)
```
ENVIRONMENT=development
SITE_NAME=Qatar Paint (Dev)
```

### Production (Set in Cloudflare Dashboard)
```
ENVIRONMENT=production
SITE_NAME=Qatar Paint
JWT_SECRET=your-secret-key-here
```

---

## Asset Optimization Checklist

### Before Deployment:

1. **Optimize Images**
   ```bash
   # Install image optimization tools
   npm install -g sharp-cli
   
   # Convert to WebP
   sharp frontend/assets/images/*.jpg -o frontend/assets/images/ -f webp
   
   # Optimize PNGs
   npm install -g pngquant-cli
   pngquant frontend/assets/images/*.png
   ```

2. **Minify CSS**
   ```bash
   # Install CSS tools
   npm install -g clean-css-cli
   
   # Merge and minify CSS
   cleancss -o frontend/styles/styles.min.css frontend/assets/css/style.css
   ```

3. **Minify JavaScript**
   ```bash
   # Install JS minifier
   npm install -g terser
   
   # Merge vendor libraries
   cat assets/js/bootstrap.bundle.min.js assets/js/swiper-bundle.min.js > frontend/assets/js/vendor.min.js
   
   # Minify custom JS
   terser assets/js/custom.js -o frontend/assets/js/main.min.js -c -m
   ```

4. **Optimize Fonts**
   - Use Font Squirrel Webfont Generator
   - Subset to Latin characters only
   - Include only weights: 400, 500, 600, 700

---

## Database Management

### Backup Database
```bash
wrangler d1 backup create qatarpaint-db
```

### Restore Database
```bash
wrangler d1 backup restore qatarpaint-db --backup-id <backup-id>
```

### Run New Migrations
```bash
wrangler d1 execute qatarpaint-db --file=database/migrations/002_add_coupons.sql
```

### Query Database
```bash
wrangler d1 execute qatarpaint-db --command="SELECT * FROM products LIMIT 10"
```

---

## R2 Storage Management

### List Files
```bash
wrangler r2 object list qatarpaint-assets
```

### Upload File
```bash
wrangler r2 object put qatarpaint-assets/uploads/image.webp --file=./image.webp
```

### Download File
```bash
wrangler r2 object get qatarpaint-assets/uploads/image.webp -o ./downloaded.webp
```

### Delete File
```bash
wrangler r2 object delete qatarpaint-assets/uploads/image.webp
```

---

## Monitoring & Analytics

### View Worker Logs
```bash
wrangler tail
```

### Check Worker Status
```bash
wrangler deploy --dry-run
```

### View D1 Stats
```bash
wrangler d1 info qatarpaint-db
```

### View R2 Stats
```bash
wrangler r2 bucket info qatarpaint-assets
```

---

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check database_id in wrangler.toml
   - Ensure database exists: `wrangler d1 list`

2. **R2 Access Denied**
   - Verify bucket name matches wrangler.toml
   - Check bucket exists: `wrangler r2 bucket list`

3. **Worker Not Serving Static Files**
   - Ensure frontend files are in correct location
   - Check ASSETS binding in wrangler.toml

4. **CORS Errors**
   - Verify CORS headers in worker.js
   - Check allowed origins match your domain

---

## Performance Optimization

### Enable Cloudflare Features:

1. **Auto Minify** (Dashboard → Speed → Optimization)
   - Enable JavaScript, CSS, HTML minification

2. **Brotli Compression** (Dashboard → Speed → Optimization)
   - Enable Brotli compression

3. **Early Hints** (Dashboard → Speed → Optimization)
   - Enable 103 Early Hints

4. **Image Optimization** (Dashboard → Speed → Images)
   - Enable Cloudflare Images
   - Auto format to WebP/AVIF

5. **Cache Rules** (Dashboard → Rules → Cache Rules)
   ```
   If URI ends with .css, .js, .png, .jpg, .svg, .webp
   Then Eligible for cache
   Cache TTL: 1 year
   ```

---

## Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Enable Cloudflare WAF (Web Application Firewall)
- [ ] Set up rate limiting rules
- [ ] Enable Bot Management
- [ ] Configure Content Security Policy headers
- [ ] Enable HTTPS (automatic with Cloudflare)
- [ ] Set up DDoS protection
- [ ] Regular database backups
- [ ] Monitor error logs

---

## Scaling

### When to Scale:

1. **High Traffic** (>100K requests/day)
   - Upgrade to Workers Paid plan
   - Enable D1 alpha for larger databases

2. **Storage Needs** (>10GB)
   - Upgrade R2 to paid tier
   - Consider Cloudflare Images for media

3. **Performance Issues**
   - Add Redis caching (Upstash)
   - Implement queue system for async tasks
   - Use Cloudflare Queue for background jobs

---

## Cost Estimation

### Free Tier (Development):
- Workers: 100K requests/day
- D1: 5M reads/day, 100K writes/day
- R2: 10GB storage, 1M reads/month

### Paid Tier (Production):
- Workers: $5/month + $0.30/million requests
- D1: $0.75/million reads, $3.75/million writes
- R2: $0.015/GB storage, $0.0004/million reads

**Estimated monthly cost for 500K requests**: $10-20/month

---

## Continuous Integration (Optional)

### GitHub Actions Example (.github/workflows/deploy.yml):
```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

---

## Support Resources

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- D1 Documentation: https://developers.cloudflare.com/d1/
- R2 Documentation: https://developers.cloudflare.com/r2/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Community Forum: https://community.cloudflare.com/

---

## Production Deployment Checklist

- [ ] Database created and migrated
- [ ] R2 bucket created
- [ ] Environment variables set
- [ ] Images optimized (WebP)
- [ ] CSS/JS minified
- [ ] Tested locally
- [ ] Custom domain configured
- [ ] SSL/TLS enabled
- [ ] Cache rules configured
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Rate limiting configured
- [ ] Error tracking set up
- [ ] Performance baseline measured

---

**Ready to deploy?** Run: `npm run deploy` 🚀
