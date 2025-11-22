# 🚀 Deployment Guide

## Overview

scarmServer uses GitHub Actions to automatically build, test, scan, and deploy Docker images to GitHub Container Registry (GHCR) on every push to `main`.

## Deployment Pipeline

### Trigger Events
- **Push to main**: Automatic deployment
- **Git tags** (v*.*.*): Semantic versioned releases
- **Manual**: Via GitHub Actions UI (workflow_dispatch)

### Quality Gates (Pre-Build)

1. **Format Check**: Prettier validation
2. **Linting**: ESLint code quality
3. **Unit Tests**: 25/25 tests must pass
4. **Coverage Thresholds**: Lines≥80%, Statements≥80%, Functions≥70%, Branches≥60%
5. **Security Scan**: Trivy filesystem scan (HIGH/CRITICAL vulnerabilities)
6. **Health Check**: Live HTTP endpoint test

### Build & Push

1. **Multi-Architecture**: linux/amd64, linux/arm64
2. **Image Registry**: ghcr.io/scarmonit/scarmserver
3. **Tags Generated**:
   - Branch name (e.g., `main`)
   - Commit SHA (e.g., `sha-abc123`)
   - `latest` (only on main branch)
   - Semantic version from package.json

### Post-Build Validation

1. **Image Security Scan**: Trivy container image scan
2. **Container Health Check**: Start container, verify /health endpoint
3. **Summary**: Deployment report in GitHub Actions

---

## Local Development

### Prerequisites
```bash
# Node.js 18+ and npm
node --version  # Should be >= 18.0.0

# Docker (optional, for container testing)
docker --version
```

### Setup
```bash
# Clone repository
git clone https://github.com/scarmonit/scarmServer.git
cd scarmServer

# Install dependencies (use --include=dev to override npm config)
npm install --include=dev --legacy-peer-deps

# Initialize git hooks
git init
npx husky install

# Run tests
npm test

# Start development server
npm run start:dev
```

### Local Testing
```bash
# Run all quality checks
npm run format:check
npm run lint
npm run test:coverage

# Start server
npm start

# Test health endpoint
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

---

## Docker Deployment

### Build Locally
```bash
# Build image
docker build -t scarmserver:local .

# Run container
docker run -d \
  --name scarmserver \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  scarmserver:local

# Health check
curl http://localhost:3000/health

# View logs
docker logs scarmserver

# Stop and remove
docker rm -f scarmserver
```

### Docker Compose
```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

---

## Production Deployment

### Pull from GHCR

#### Public Repository
```bash
docker pull ghcr.io/scarmonit/scarmserver:latest
docker run -d -p 3000:3000 ghcr.io/scarmonit/scarmserver:latest
```

#### Private Repository
```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u scarmonit --password-stdin

# Pull image
docker pull ghcr.io/scarmonit/scarmserver:latest

# Run
docker run -d \
  --name scarmserver \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/scarmonit/scarmserver:latest
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Runtime environment |
| `PORT` | `3000` | HTTP server port |
| `HOST` | `0.0.0.0` | Bind address |
| `LOG_LEVEL` | `info` | Logging verbosity |

### Production Compose
```yaml
version: '3.8'
services:
  scarmserver:
    image: ghcr.io/scarmonit/scarmserver:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      HOST: 0.0.0.0
      LOG_LEVEL: info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

---

## CI/CD Pipeline Details

### Workflow File
`.github/workflows/deploy.yml`

### Jobs

#### 1. Test (Pre-build Quality Gates)
- Runs on: `ubuntu-latest`
- Node version: 22.x
- Steps:
  1. Checkout code
  2. Install dependencies
  3. Format check (Prettier)
  4. Lint (ESLint)
  5. Unit tests with coverage thresholds
  6. Install Trivy
  7. Security scan filesystem (HIGH/CRITICAL)
  8. Health endpoint smoke test

#### 2. Build-and-Push
- Runs on: `ubuntu-latest`
- Requires: `test` job success
- Steps:
  1. Checkout code
  2. Read version from package.json
  3. Setup QEMU (multi-arch)
  4. Setup Docker Buildx
  5. Login to GHCR
  6. Extract metadata (tags/labels)
  7. Build and push multi-arch image
  8. Install Trivy
  9. Security scan image (HIGH/CRITICAL)
  10. Container health check
  11. Deployment summary

### Permissions Required
- `contents: read` - Clone repository
- `packages: write` - Push to GHCR

---

## Manual Deployment

### Trigger via GitHub UI
1. Go to repository → Actions
2. Select "Deploy Container" workflow
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow"

### Create a Release
```bash
# Update version in package.json
npm version patch  # or minor, major

# Tag and push
git push origin main --tags

# Workflow automatically triggers on tag push
```

---

## Monitoring & Health Checks

### Health Endpoint
```bash
GET /health
```

**Response (200 OK):**
```json
{"status":"ok"}
```

### Docker Health Check
Built into image via `HEALTHCHECK` directive:
```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:$PORT/health | grep '"status":"ok"' || exit 1
```

Check health status:
```bash
docker ps  # STATUS column shows "healthy" or "unhealthy"
docker inspect scarmserver --format='{{.State.Health.Status}}'
```

---

## Troubleshooting

### Build Fails in CI

**Issue**: npm install fails  
**Solution**: Check `deploy.yml` uses `--include=dev --legacy-peer-deps`

**Issue**: Tests fail  
**Solution**: Run locally: `npm run test:coverage`

**Issue**: Coverage below threshold  
**Solution**: Add tests to meet thresholds (Lines≥80%, Statements≥80%, Functions≥70%, Branches≥60%)

### Image Security Scan Fails

**Issue**: HIGH/CRITICAL vulnerabilities found  
**Solution**: 
1. Update dependencies: `npm update`
2. Review Trivy report in CI logs
3. Apply security patches
4. Rebuild and re-scan

### Container Won't Start

**Issue**: Port already in use  
**Solution**: 
```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # macOS/Linux

# Kill process or use different port
docker run -p 3001:3000 ghcr.io/scarmonit/scarmserver:latest
```

**Issue**: Health check failing  
**Solution**: Check logs
```bash
docker logs scarmserver
```

### Permission Denied (GHCR)

**Issue**: Cannot push to GHCR  
**Solution**: Ensure GitHub Actions has `packages: write` permission

**Issue**: Cannot pull private image  
**Solution**: 
```bash
# Create GitHub Personal Access Token with `read:packages` scope
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

---

## Security Best Practices

1. **Keep Dependencies Updated**: Run `npm audit` and `npm update` regularly
2. **Review Trivy Reports**: Fix HIGH/CRITICAL vulnerabilities before deployment
3. **Rotate Secrets**: Update GitHub tokens and credentials periodically
4. **Least Privilege**: Use minimal permissions for service accounts
5. **Network Isolation**: Run containers in isolated networks in production
6. **TLS/HTTPS**: Use reverse proxy (nginx, Traefik) for HTTPS termination

---

## Advanced Topics

### Multi-Stage Builds
Current Dockerfile uses single-stage. For optimization, consider:
- Separate build and runtime stages
- Use distroless base images for minimal attack surface
- Cache npm dependencies layer

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scarmserver
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scarmserver
  template:
    metadata:
      labels:
        app: scarmserver
    spec:
      containers:
      - name: scarmserver
        image: ghcr.io/scarmonit/scarmserver:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
```

### Continuous Delivery
For auto-deployment to production, add a workflow that:
1. Monitors GHCR for new `:latest` tag
2. Pulls image on production server
3. Performs rolling update
4. Validates health checks
5. Rollback on failure

---

## Resources

- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)

---

**Last Updated**: November 22, 2025  
**Deployment Status**: ✅ Production Ready

