FROM node:11.10.1-alpine

WORKDIR /app

EXPOSE 8080

RUN apk --no-cache update \
    && apk --no-cache add bash jq ncurses curl \
    && apk --no-cache --repository https://nl.alpinelinux.org/alpine/edge/testing add flow \
    && rm -fr /var/cache/apk/* \
    && npm install -g apollo gql \
    && npm completion >> ~/.bashrc \
    echo "Fin des istallations" 

CMD ["sleep", "360000"]
