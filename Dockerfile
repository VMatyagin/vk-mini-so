FROM node:12-alpine as builder

# install and cache app dependencies
# COPY package.json ./
# RUN yarn && mkdir /client && mv ./node_modules ./client
RUN mkdir /client

WORKDIR /client

COPY . .



# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
FROM nginx:1.21.6-alpine
COPY --from=builder /client/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
