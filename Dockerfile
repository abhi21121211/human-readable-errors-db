# Use the Node.js image
FROM node:18

# Set working directory
WORKDIR /src/app.js

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all project files
COPY . .

# Expose the port used by the application
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
