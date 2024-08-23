FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN yarn

# Copy the source code
COPY . .

# Build the application
RUN yarn run build

# Step 2: Run the application
FROM node:18

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy the env file
COPY .env ./

# Expose the port the app runs on
EXPOSE 7800

# Start the application
CMD ["node", "dist/main.js"]
