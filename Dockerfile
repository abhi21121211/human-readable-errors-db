# Use the Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port Render will use
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
