FROM node:20.17.0-alpine AS base

# Install system dependencies
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Generate GraphQL types
RUN npm run codegen

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start"]