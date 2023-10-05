#!/bin/bash
if [[ ${LETSENCRYPT_HOSTNAME:+x} == "x" ]]; then
  certbot renew --quiet --non-interactive --post-hook 'nginx -s reload'
fi
