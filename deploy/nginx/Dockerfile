FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN apk add iputils vim bash certbot certbot-nginx && apk update && apk upgrade
ADD build/nginx/nginx.conf /etc/nginx/nginx.conf
ADD build/nginx/default.nginx /etc/nginx/sites-enabled/default.conf
COPY build/nginx/renew_cert.sh /etc/periodic/daily
RUN chmod +x /etc/periodic/daily/renew_cert.sh
COPY build/nginx/configure_cert.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/configure_cert.sh
COPY build/nginx/start_crond.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/start_crond.sh