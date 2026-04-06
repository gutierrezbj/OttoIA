# OttoIA Frontend - Multi-stage build
# Build context is OttoAI root (not frontend/) so we can access design-system/

FROM node:22-alpine AS build
WORKDIR /build

# Copy design system (needed by tailwind.config.js and index.css)
COPY design-system/ /build/design-system/

# Copy frontend package.json and install deps
COPY ottoia-app/frontend/package.json /build/ottoia-app/frontend/
WORKDIR /build/ottoia-app/frontend
RUN npm install

# Copy frontend source
COPY ottoia-app/frontend/ /build/ottoia-app/frontend/
RUN npm run build

# Serve with nginx
FROM nginx:1.27-alpine
COPY --from=build /build/ottoia-app/frontend/dist /usr/share/nginx/html
COPY ottoia-app/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
