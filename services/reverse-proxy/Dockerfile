FROM nginx:1.10.3-alpine

ARG CONFIG_FILE

COPY $CONFIG_FILE /etc/nginx
RUN mv /etc/nginx/$CONFIG_FILE /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
