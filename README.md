# Dockerized Service Deployment

This project implements a complete CI/CD pipeline for deploying a Dockerized Node.js service using Ansible and GitHub Actions. It follows the project requirements from [roadmap.sh's Dockerized Service Deployment project](https://roadmap.sh/projects/dockerized-service-deployment) with some additional enhancements.

## Project Overview

We built a Node.js service that:
- Serves a "Hello, world!" message at the root endpoint
- Has a protected `/secret` endpoint with Basic Authentication
- Includes a `/health` endpoint for health checks
- Is containerized using Docker
- Is deployed using Ansible and GitHub Actions
- Uses Nginx as a reverse proxy

## Implementation Details

### 1. Node.js Application (`/app`)
```javascript
// Basic Express app with three endpoints:
- GET /         → Returns "Hello, world!"
- GET /secret   → Protected endpoint (Basic Auth)
- GET /health   → Health check endpoint
```

### 2. Docker Configuration
- Created `Dockerfile` for the Node.js application
- Multi-stage build for optimized image size
- Uses Node.js 18 Alpine base image
- Proper security practices (non-root user, minimal dependencies)

### 3. Ansible Setup (`/ansible`)
- Created playbooks for automated deployment:
  - `docker-setup.yml`: Installs Docker and Nginx
  - `inventory.ini`: Defines control and target nodes
  - `templates/nginx.conf.j2`: Nginx configuration template

### 4. GitHub Actions Workflow (`.github/workflows`)
- Automated CI/CD pipeline that:
  - Builds Docker image
  - Pushes to GitHub Container Registry
  - Deploys to target EC2 instance
  - Uses secrets for secure credential management

### 5. Additional Features
- **Enhanced Security**:
  - UFW firewall configuration
  - Proper permission management
  - Environment variable handling
- **Infrastructure Management**:
  - Separate control and target nodes
  - Nginx reverse proxy setup
  - Docker container lifecycle management

## Project Structure
```
dockerized-service-deployment/
├── app/
│   ├── app.js              # Main application code
│   ├── Dockerfile          # Docker configuration
│   ├── package.json        # Node.js dependencies
│   └── .env.example        # Environment variables template
├── ansible/
│   ├── docker-setup.yml    # Ansible playbook
│   ├── inventory.ini       # Server inventory
│   └── templates/
│       └── nginx.conf.j2   # Nginx configuration template
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
└── README.md              # Project documentation
```

## Implementation Steps

1. **Application Development**
   ```bash
   # Initialize Node.js project
   npm init -y
   npm install express basic-auth
   ```

2. **Docker Configuration**
   ```dockerfile
   # Multi-stage build
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .

   FROM node:18-alpine
   WORKDIR /app
   COPY --from=builder /app .
   EXPOSE 3000
   CMD ["node", "app.js"]
   ```

3. **Ansible Setup**
   ```yaml
   # docker-setup.yml
   - name: Setup Docker and Nginx
     hosts: target
     become: yes
     tasks:
       - name: Install Docker
       - name: Configure Nginx
       - name: Deploy application
   ```

4. **GitHub Actions Configuration**
   ```yaml
   # deploy.yml
   name: Deploy Dockerized Service
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Build and push Docker image
         - name: Deploy to target node
   ```

## Proof of Implementation

Here are the test results showing our working implementation:

1. **Health Check Endpoint**
```json
// GET http://34.238.146.221:3000/health
{"status":"healthy","timestamp":"2025-02-10T09:58:17.768Z"}
```

2. **Root Endpoint**
```json
// GET http://34.238.146.221:3000/
{"message":"Hello, world!","timestamp":"2025-02-10T09:58:26.676Z"}
```

3. **Protected Endpoint**
```json
// GET http://34.238.146.221:3000/secret (with Basic Auth)
{"message":"'This is a secret message'","timestamp":"2025-02-10T09:58:35.283Z"}
```

## Learning Outcomes

1. **Docker Best Practices**
   - Multi-stage builds
   - Security considerations
   - Environment variable management

2. **Ansible Automation**
   - Infrastructure as Code
   - Configuration management
   - Role-based automation

3. **CI/CD with GitHub Actions**
   - Automated workflows
   - Secret management
   - Container registry integration

4. **Security Considerations**
   - Basic Authentication
   - Environment variables
   - Firewall configuration (UFW)
   - Nginx as reverse proxy

5. **Infrastructure Management**
   - AWS EC2 instance management
   - Network security groups
   - SSH key management

## Challenges Faced and Solutions

1. **Port Access Issues**
   - Problem: Application not accessible after deployment
   - Solution: Configured both UFW and AWS security groups

2. **Process Management**
   - Problem: Port conflicts with existing processes
   - Solution: Proper process cleanup and Docker container management

3. **GitHub Actions Authentication**
   - Problem: Container registry access
   - Solution: Proper secret management and permissions

## Project Page URL
[roadmap.sh Dockerized Service Deployment](https://roadmap.sh/projects/dockerized-service-deployment)

## Future Improvements
1. Add HTTPS support with Let's Encrypt
2. Implement container health checks
3. Add monitoring and logging solutions
4. Implement blue-green deployment strategy
5. Add automated backups and disaster recovery