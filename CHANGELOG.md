# Changelog - Flask-RESTX Frontend

All notable changes to the frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [1.0.3] - 2026-05-01

### Fixed
- **Frontend unable to call backend in ECS** — `.env.local` (containing `http://localhost:5000/api`) was not excluded from Docker builds, causing the localhost URL to be baked into the production JS bundle
- Added `.env.local` to `.dockerignore` so production builds use the correct relative `/api` base URL
- Configured ECS Service Connect for service-to-service communication, enabling nginx to resolve `flask-restx-backend:5000`

## [1.0.2] - 2026-04-14

### Security
- **Fixed 27 CVEs** across all severity levels in Alpine base image packages
- Trivy scan: 0 vulnerabilities (all severity levels)
- npm audit: 0 vulnerabilities (fixed 4 npm dependency vulnerabilities via `npm audit fix`)
- Multi-arch image build (linux/amd64, linux/arm64)

#### OpenSSL (libcrypto3 / libssl3): 3.5.5-r0 → 3.5.6-r0
- **CVE-2026-28390** (HIGH): Denial of Service due to NULL pointer dereference in CMS
- **CVE-2026-28388** (MEDIUM): Denial of Service due to NULL pointer dereference in delta CRL
- **CVE-2026-28389** (MEDIUM): Denial of Service vulnerability in CMS processing
- **CVE-2026-31790** (MEDIUM): Information Disclosure from Uninitialized Memory via Invalid RSA Public Key
- **CVE-2026-2673** (LOW): TLS 1.3 server may choose unexpected key agreement group
- **CVE-2026-28387** (LOW): Arbitrary code execution due to use-after-free in DANE TLSA authentication
- **CVE-2026-31789** (LOW): Denial of Service via excessively large OCTET STRING conversion

#### libexpat: 2.7.4-r0 → 2.7.5-r0
- **CVE-2026-32776** (MEDIUM): Denial of Service due to NULL pointer dereference
- **CVE-2026-32777** (MEDIUM): Denial of Service via infinite loop in DTD content parsing
- **CVE-2026-32778** (MEDIUM): Denial of Service via NULL pointer dereference after out-of-memory condition

#### libpng: 1.6.55-r0 → 1.6.57-r0
- **CVE-2026-33416** (HIGH): Arbitrary code execution due to use-after-free vulnerability
- **CVE-2026-33636** (HIGH): Information disclosure and denial of service via out-of-bounds read/write
- **CVE-2026-34757** (MEDIUM): Information disclosure and data corruption via use-after-free vulnerability

#### libuuid (util-linux): 2.41.2-r0 → 2.41.4-r0
- **CVE-2026-27456** (MEDIUM): TOCTOU in the mount program when setting up loop devices

#### musl / musl-utils: 1.2.5-r21 → 1.2.5-r23
- **CVE-2026-40200** (UNKNOWN): Stack-based buffer overflow in musl libc
- **CVE-2026-6042** (UNKNOWN): Security flaw in musl libc up to 1.2.6

#### zlib: 1.3.1-r2 → 1.3.2-r0
- **CVE-2026-22184** (HIGH): Arbitrary code execution via buffer overflow in untgz utility
- **CVE-2026-27171** (MEDIUM): Denial of Service via infinite loop in CRC32 combine functions

### Technical Details
- Base: nginx:alpine (Alpine 3.23.3)
- Architectures: linux/amd64, linux/arm64
- Image tag: `flask-restx-frontend:v1.0.2`
- Built with `docker buildx --no-cache` to ensure fresh package pulls

## [1.0.1] - 2026-03-05

### Security
- **Fixed libpng CVE-2026-25646** (HIGH): Heap buffer overflow in png_set_quantize
  - Updated libpng from 1.6.54-r0 to 1.6.55-r0
- **Fixed axios vulnerability** (HIGH): Denial of Service via __proto__ key in mergeConfig
  - Updated axios to patched version
- **Fixed rollup vulnerability** (HIGH): Arbitrary File Write via Path Traversal
  - Updated rollup to patched version
- Added automatic package upgrade step in Dockerfile (`apk upgrade`)
- Trivy scan: 0 vulnerabilities (all severity levels)
- npm audit: 0 vulnerabilities

### Changed
- Updated Dockerfile to use `nginx:alpine` (latest) instead of pinned version
- Added `RUN apk update && apk upgrade --no-cache` to ensure latest security patches
- Updated npm dependencies via `npm audit fix`

### Technical Details
- Base: nginx:alpine (Alpine 3.23.3)
- libpng: 1.6.55-r0
- Image tag: `flask-restx-frontend:v1.0.1`

## [1.0.1-al-prod-01x] - 2026-02-10

### Added
- Production-optimized Docker image with Nginx 1.29.5
- Multi-stage build process for minimal production image
- Custom `nginx.conf` for SPA routing support
- Nginx modules: NJS 0.9.5, ACME 0.3.1, GeoIP, Image Filter, XSLT
- Docker entrypoint scripts for dynamic configuration
- IPv6 support configuration
- Environment variable substitution in Nginx templates
- Worker process auto-tuning based on CPU cores

### Changed
- **Architecture**: ARM64 → AMD64 for production compatibility
- **Base image**: Amazon Linux 2023 → Alpine Linux (nginx:1.29.5-alpine)
- **Image size**: 282 MB → 26 MB (90% reduction)
- **Runtime**: Node.js development server → Nginx production server
- **Port**: 3000 → 80 (standard HTTP)
- **Working directory**: /app → /
- **Health check**: curl → wget with spider mode
- Serves pre-built static assets from `/usr/share/nginx/html`

### Security
- Minimal Alpine Linux base image (reduced attack surface)
- No build tools or source code in production image
- No Node.js runtime in production (static assets only)
- Nginx 1.29.5 mainline with latest security patches
- Image tag: `flask-restx-frontend:v1.0.1-al-prod-01x`

### Performance
- 90% smaller image size for faster deployments
- Nginx optimized for serving static assets
- Reduced memory footprint
- Faster container startup time

### Technical Details
- Base: nginx:1.29.5-alpine
- Architecture: AMD64
- Nginx modules: NJS, ACME, GeoIP, Image Filter, XSLT
- Entrypoint: /docker-entrypoint.sh
- Command: nginx -g "daemon off;"

## [1.0.1-al] - 2026-02-05

### Added
- `Dockerfile.amazonlinux` - Amazon Linux 2023 based image with custom OpenSSL 3.6.1 build

### Security
- **Fixed all CVEs in Amazon Linux image** (`Dockerfile.amazonlinux`)
  - Updated npm to latest version (fixes 8 CVEs in npm dependencies)
  - Fixed HIGH severity: cross-spawn (CVE-2024-21538), glob (CVE-2025-64756), npm (CVE-2026-0775), tar (CVE-2026-23745, CVE-2026-23950, CVE-2026-24842)
  - Fixed LOW severity: brace-expansion (CVE-2025-5889), diff (CVE-2026-24001)
  - Trivy scan: 0 vulnerabilities (all severity levels)
- Custom OpenSSL 3.6.1 build with RPATH configuration
- Image tag: `flask-restx-frontend:v1.0.1-al`

### Known Issues
- None

## [1.0.0] - 2026-02-05

### Added
- React 18 frontend application
- Vite 7.3.1 for fast development and building
- TailwindCSS for styling
- React Router for navigation
- Course management UI (list, create, edit, delete)
- Student management UI (list, create, edit, delete)
- Axios for API communication
- React Hot Toast for notifications
- Proxy configuration for backend API communication
- Docker support with health checks
- Dockerfile with Node 20-alpine base image
- .dockerignore for optimized builds

### Changed
- Updated Vite proxy configuration to support Docker networking
- Backend API target: `http://flask-restx-backend:5000` (Docker) or `http://localhost:5000` (local)
- **Switched from Alpine to Debian-based image** for better OpenSSL security update support

### Security
- Updated Vite from 5.0.8 to 7.3.1 (fixed esbuild vulnerability)
- Fixed esbuild vulnerability (GHSA-67mh-4wv8-2f99)
- Updated npm to 11.9.0 in Docker image (fixed 4 system package vulnerabilities)
  - brace-expansion
  - cross-spawn
  - diff
  - glob
- Added curl to Docker image for health checks
- npm audit: 0 vulnerabilities
- Trivy security scan: 0 vulnerabilities

### Technical Details
- Node 20-alpine base image
- React 18.2.0
- Vite 7.3.1
- TailwindCSS 3.4.0
- React Router 6.20.0
- Axios 1.6.2

### Known Issues
- **OpenSSL CVEs in base image** (`Dockerfile`): The Node.js 20 base image contains OpenSSL 3.0.18 which has known CVEs (CVE-2025-15467, CVE-2025-9230, CVE-2025-69421, CVE-2025-69420, CVE-2025-69419, CVE-2026-22796, CVE-2025-68160, CVE-2025-69418, CVE-2025-9232, CVE-2026-22795). These require OpenSSL 3.6.2+
  - **Impact**: Most CVEs require parsing malicious PKCS#12, CMS, or timestamp files which are not used by this application
  - **Resolution**: Use `Dockerfile.amazonlinux` (version 1.0.1-al) which includes custom OpenSSL 3.6.1 build

[Unreleased]: https://github.com/yourusername/yourrepo/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/yourusername/yourrepo/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/yourusername/yourrepo/releases/tag/v1.0.1
[1.0.1-al-prod-01x]: https://github.com/yourusername/yourrepo/releases/tag/v1.0.1-al-prod-01x
[1.0.1-al]: https://github.com/yourusername/yourrepo/releases/tag/v1.0.1-al
[1.0.0]: https://github.com/yourusername/yourrepo/releases/tag/v1.0.0
