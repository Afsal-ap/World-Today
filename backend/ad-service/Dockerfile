# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript  

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
