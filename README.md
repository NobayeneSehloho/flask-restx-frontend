# Flask-RESTX Frontend

React frontend application built with Vite and TailwindCSS for the Flask-RESTX API.

## Features

- React 18 with modern hooks
- Vite for fast development and building
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests
- React Hot Toast for notifications
- Proxy configuration for API communication

## Requirements

- Node.js 20+
- npm 11+

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Docker

### Build Image

```bash
docker build -t flask-restx-frontend:v1.0.0 .
```

### Run Container

```bash
docker run -d -p 3000:3000 flask-restx-frontend:v1.0.0
```

### With Docker Network

```bash
docker network create flask-restx-network
docker run -d --name flask-restx-frontend \
  --network flask-restx-network \
  -p 3000:3000 \
  flask-restx-frontend:v1.0.0
```

## Build for Production

```bash
npm run build
npm run preview
```

## API Configuration

The frontend connects to the backend API through Vite's proxy configuration:

- **Local development**: `http://localhost:5000`
- **Docker**: `http://flask-restx-backend:5000`

Configuration in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: process.env.VITE_API_URL || 'http://flask-restx-backend:5000',
    changeOrigin: true
  }
}
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (optional, defaults to container name)

## Health Check

The Docker image includes a health check that runs every 30 seconds:
```bash
curl -f http://localhost:3000/ || exit 1
```

## Security

- All dependencies scanned with npm audit (0 vulnerabilities)
- Vite 7.3.1 (latest version)
- Updated npm to latest version in Docker image

## Project Structure

```
flask-restx-frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── context/        # React context
│   ├── hooks/          # Custom hooks
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── Dockerfile
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # TailwindCSS configuration
├── package.json
└── .dockerignore
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

### Course Management
- View all courses
- Create new courses
- Edit existing courses
- Delete courses
- View students enrolled in each course

### Student Management
- View all students
- Create new students
- Edit student information
- Delete students
- Assign students to courses

## Notes

- Frontend communicates with backend via `/api` proxy
- In Docker, containers must be on the same network
- Hot reload enabled in development mode
- TailwindCSS configured for responsive design
