FROM node:19.5.0-alpine as build

WORKDIR /client

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .
#COPY src/ src/
#COPY public/ public/
#COPY nginx.conf .

RUN echo "HI"
RUN ls -lh

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]