# Use the latest Docker syntax parser
# syntax=docker/dockerfile:1

#Stage 0: Define ARGs

# Define build arguments for environment variables
ARG NODE_VERSION=22.14.0

# Set the baseUrl ARG in the build stage to compile it - Will be replaced by docker build command
ARG VITE_API_BASE_URL=${VITE_API_BASE_URL} 

# Stage 1: Build the application
FROM node:${NODE_VERSION}-alpine AS build

# Set working directory for all build stages.
WORKDIR /usr/src/app

RUN npm ci

# Copy the rest of the source files into the image.
COPY . .

# Build production assets.
RUN npm run build

# SET NODE_ENV to production
ENV NODE_ENV=production

# Stage 2: Serve the static files with Nginx
FROM nginx:1.27.4-alpine

# Copy the build output from the build stage to Nginx's public folder
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose the port
EXPOSE 80

# Nginx starts automatically, no need for CMD
