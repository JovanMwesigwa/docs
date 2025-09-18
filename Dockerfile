FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install mintlify globally
RUN npm install -g mintlify

# Copy documentation files
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
CMD ["mintlify", "dev", "--port", "3000", "--host", "0.0.0.0"]