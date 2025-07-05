FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "start"]