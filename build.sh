#!/usr/bin/env bash
set -e

version=$(echo "$IMAGE" | cut -d ":" -f 2 )

ref=$(docker build -q "$BUILD_CONTEXT" --build-arg=VERSION="$version" | tee)

docker tag "$ref" "$IMAGE"

if $PUSH_IMAGE; then
  docker push "$IMAGE"
fi