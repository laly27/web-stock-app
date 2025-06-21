# Étape 1 : build + export statique
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build       # génère .output/server et .output/public
RUN npm run generate    # export statique vers .output/public

# Étape 2 : image de production Nginx
FROM nginx:stable-alpine

# Copie du site statique exporté
COPY --from=build /app/.output/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
