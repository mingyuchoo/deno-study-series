#!/bin/bash

#deno lint && \
deno fmt && \
deno run \
  --allow-env \
  --allow-net \
  --allow-read \
  app.ts
