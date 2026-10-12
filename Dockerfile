FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4315 DATA_DIR=/app/data
EXPOSE 4315
CMD ["node", "dist-server/main.js"]
