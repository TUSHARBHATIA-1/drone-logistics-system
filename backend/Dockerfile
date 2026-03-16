FROM node:18

# Install build dependencies for C++
RUN apt-get update && apt-get install -y g++ 

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY package*.json ./

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Compile C++ engine
RUN npm run compile-engine

EXPOSE 5000

CMD ["npm", "start", "--prefix", "backend"]
