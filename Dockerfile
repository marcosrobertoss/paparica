# Stage 1: build the React frontend
FROM node:22-slim AS build
WORKDIR /app
COPY client/package*.json client/
RUN npm --prefix client ci
COPY client client
RUN npm --prefix client run build

# Stage 2: runtime — Express serves the API + the built frontend
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY server/package*.json server/
RUN npm --prefix server ci --omit=dev
COPY server server
COPY --from=build /app/client/dist client/dist
EXPOSE 3000
# SQLite lives in /app/data — mount a volume there so data survives redeploys
CMD ["node", "server/src/index.js"]
