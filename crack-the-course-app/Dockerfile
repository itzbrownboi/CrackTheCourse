# Use Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy everything inside the crack-the-course-app directory into the container
COPY crack-the-course-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app into the container
COPY crack-the-course-app/ .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
