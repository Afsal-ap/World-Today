# Use Debian-based Node.js image (compatible with bcrypt)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including bcrypt)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the TypeScript project
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --production

# Expose your app's port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
