FROM alpine:3.16

WORKDIR /usr/src/app

ENV URL="http://backend-svc:4567/api/todos"

COPY script.sh .

RUN apk add --no-cache curl

CMD ./script.sh