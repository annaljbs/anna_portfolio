# Development image: runs `next dev` with the project bind-mounted (see compose.yaml).
FROM node:24-alpine

WORKDIR /app

# Install dependencies first so the layer is cached until package*.json changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Bind to all interfaces so the port is reachable from the host.
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
