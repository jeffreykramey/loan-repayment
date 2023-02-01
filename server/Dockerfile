FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD sh -c "npx prisma migrate dev && npm start"
