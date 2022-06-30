#!/bin/sh
set -e

if [ $URL ]
then
  wikiLink=$(curl https://en.wikipedia.org/wiki/Special:Random -I | grep -Fi location | cut -c 11-)
  content="check this sweet article: $wikiLink"
  trimmed=$(echo $content | tr -d '\r')
  JSON_FMT='{"content":"%s"}\n'
  JSON_STRING=$(printf "$JSON_FMT" "$trimmed")
  curl -X POST $URL \
   -H 'Content-Type: application/json' \
   -d "$JSON_STRING"
fi