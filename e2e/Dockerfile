FROM cypress/browsers:node14.19.0-chrome100-ff99-edge
WORKDIR /app

COPY package.json .
COPY package-lock.json .

ENV CI=1
RUN npm ci

RUN npx cypress verify