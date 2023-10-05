#!/bin/bash
if [[ ${LETSENCRYPT_HOSTNAME:+x} == "x" ]]; then
  if [ ! -f "/etc/letsencrypt/live/${LETSENCRYPT_HOSTNAME}/fullchain.pem"  ]; then
    # need to register this domain
    # since nginx is not running use standalone webserver to register
    # this requires internet access to this server at port 80
    # see https://letsencrypt.org/docs/challenge-types/ for how letsencrypt verifies server
    certbot certonly --standalone -n --agree-tos --register-unsafely-without-email -d ${LETSENCRYPT_HOSTNAME}
    if [ $? -eq 0 ]; then
      # backup any existing cert/key
      if [[ ! -L /etc/nginx/ssl/default.crt ]]; then
        mv /etc/nginx/ssl/default.crt /etc/nginx/ssl/default.crt_$(date +%s)
      fi
      if [[ ! -L /etc/nginx/ssl/default.key ]]; then
        mv /etc/nginx/ssl/default.key /etc/nginx/ssl/default.key_$(date +%s)
      fi
      # make sure links are there
      ln -sf /etc/letsencrypt/live/${LETSENCRYPT_HOSTNAME}/fullchain.pem /etc/nginx/ssl/default.crt
      ln -sf /etc/letsencrypt/live/${LETSENCRYPT_HOSTNAME}/privkey.pem /etc/nginx/ssl/default.key
    fi
  else
    certbot renew --quiet --non-interactive
  fi
fi
