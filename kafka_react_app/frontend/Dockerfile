# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Start the development server
CMD ["npm", "start"]