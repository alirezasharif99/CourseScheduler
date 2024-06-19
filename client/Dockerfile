FROM node:latest AS base

WORKDIR /src
COPY . .
RUN npm install

FROM base AS builder

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# delete default nginx assets
RUN rm -rf ./*

# copy nginx conf
COPY ./nginx/nginx-prod.conf /etc/nginx/nginx.conf

# copy certs
COPY ./nginx/gke.crt /etc/nginx/gke.crt
COPY ./nginx/gke.key /etc/nginx/gke.key

# copy React assets to html folder
COPY --from=builder /src/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]