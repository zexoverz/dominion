FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
COPY reports/ ./reports/

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
