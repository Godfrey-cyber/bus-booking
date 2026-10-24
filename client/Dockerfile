FROM node:20-alpine AS web

WORKDIR /app

COPY package.json package-lock.json ./

# RUN npm ci --include=dev
RUN NODE_OPTIONS="--max-old-space-size=512" npm ci --include=dev

COPY . ./

# Build
# RUN npm run build
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]