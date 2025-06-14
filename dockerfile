# Use official Node.js Alpine image for smaller size
FROM node:alpine3.18

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json ./
RUN npm install

# Copy the rest of your application
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
