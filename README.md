# BPCN

- frontend `nx serve frontend`
- frontend ssr `nx run frontend:serve-ssr`
- backend `npx serve strapi`


🐳 Docker & Deployment Strategy
Monorepo Overview
This Nx workspace contains two main deployable apps:

apps/strapi: A Strapi v5 backend

apps/frontend: An Angular 19 SSR frontend

Both apps are containerized independently and deployed via Railway. This provides us with isolated, production-ready environments for each app.

📁 Dockerfile Locations
App	Path	Notes
Strapi	apps/strapi/Dockerfile	Builds and runs the Strapi backend. Includes build and runtime stages.
Frontend	apps/frontend/Dockerfile	Builds and runs the Angular SSR frontend using nx and server.mjs.

Each app also has its own .dockerignore file to avoid copying large or unnecessary files into the image context.

📄 .dockerignore Contents (example)
dockerignore
Copy
Edit
node_modules
dist
.cache
*.log
.env*
nx-out
Keep this alongside each Dockerfile.

🛠 Build Process
Frontend (apps/frontend):

Installs all workspace deps via npm ci

Runs nx run frontend:build:ssr

Uses dist/apps/frontend/server/server.mjs as the SSR entrypoint

Strapi (apps/strapi):

Installs deps

Runs strapi build

Starts via strapi start after copying over build artifacts

🧭 Railway Deployment
Each app is deployed separately on Railway using its own service.

Use the Railway web UI or railway up to deploy each service.

Environment variables (e.g., APP_KEYS, DATABASE_URL, STRAPI_URL, etc.) must be defined in the Railway dashboard.

Railway autodetects Dockerfiles and builds accordingly.

🧪 Troubleshooting Tips
If Strapi fails to boot, check for missing APP_KEYS, database issues, or missing plugins.

If the frontend SSR app fails, ensure your .env values are being read (or baked into the Docker image).

Use Railway logs to debug container startup issues (railway logs or UI).