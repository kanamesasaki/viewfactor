FROM node:lts-bookworm

WORKDIR /workspace/viewfactor

# Copy source files
COPY . .

# Install dependencies
RUN npm install

# Expose port for local development (if needed)
EXPOSE 8080

# Command to serve the built files
CMD ["npm", "start"]
