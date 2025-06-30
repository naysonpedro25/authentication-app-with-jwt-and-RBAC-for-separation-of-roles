FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build 
COPY --from=builder /app/prisma ./prisma 

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:production"]
