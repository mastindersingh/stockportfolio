# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Accept build argument
ARG VITE_API_BASE_URL="/api"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files from frontend directory
COPY frontend/package*.json ./
RUN npm install

# Copy source code from frontend directory
COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/tsconfig*.json ./
COPY frontend/vite.config.ts ./

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy nginx configuration (assuming nginx folder is at project root)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]