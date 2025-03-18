# Define build arguments for environment variables
ARG NODE_VERSION=22.14.0
ARG VITE_API_BASE_URL


# First stage: Build the application
FROM node:${NODE_VERSION}-alpine AS build

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Set environment variables during the build process
ENV VITE_API_BASE_URL=http://localhost:3000



RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

# SET NODE_ENV to production
ENV NODE_ENV=production
ENV VITE_APP_API_URL=https://api.example.com

# Create a new stage for the production image
FROM nginx:alpine

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Nginx starts automatically, no need for CMD
