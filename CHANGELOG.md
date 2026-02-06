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

[Unreleased]: https://github.com/yourusername/yourrepo/compare/v1.0.0...HEAD
[1.0.1-al]: https://github.com/yourusername/yourrepo/releases/tag/v1.0.1-al
[1.0.0]: https://github.com/yourusername/yourrepo/releases/tag/v1.0.0
