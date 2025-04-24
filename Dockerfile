FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all app files (including index.js)
COPY . ./

# Expose the port
EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "run", "dev"]
