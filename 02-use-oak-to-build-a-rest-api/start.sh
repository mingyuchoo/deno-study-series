#!/bin/bash

# deno lint && \
deno fmt && \
deno run \
  --allow-env \
  --allow-net \
  app.ts
