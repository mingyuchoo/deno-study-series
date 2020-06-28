#!/bin/bash
deno fmt *.ts
deno run \
  --allow-env \
  --allow-net \
   app.ts