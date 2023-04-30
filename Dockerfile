FROM alpine:latest

# Install wireless tools
RUN apk add --no-cache wireless-tools

ADD . .

RUN apk add --update nodejs npm
RUN apk add --update npm
RUN apk add --update wpa_supplicant
RUN npm install
RUN npm run build

CMD ["node", "build"]
