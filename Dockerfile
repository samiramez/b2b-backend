# Use Node.js 24 image
FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app files
COPY . .

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "app.js"]
