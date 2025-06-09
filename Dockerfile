FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Rebuild bcrypt to ensure it works with the environment
RUN npm rebuild bcrypt --build-from-source

RUN npm install multer

# Create persistent directories for Back4App
RUN mkdir -p /app/public/files && \
    mkdir -p /app/uploads && \
    chown -R node:node /app/public/files && \
    chown -R node:node /app/uploads && \
    chmod -R 755 /app/public/files && \
    chmod -R 755 /app/uploads

# Copy all app files (including index.js)
COPY . ./

# Ensure directories exist and have correct permissions after copy
RUN mkdir -p /app/public/files && \
    mkdir -p /app/uploads && \
    chown -R node:node /app/public/files && \
    chown -R node:node /app/uploads && \
    chmod -R 755 /app/public/files && \
    chmod -R 755 /app/uploads

# Expose the port
EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "start"]
