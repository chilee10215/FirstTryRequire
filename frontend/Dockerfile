# Use Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from first-work-item subdirectory
COPY first-work-item/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from first-work-item subdirectory
COPY first-work-item/ .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]