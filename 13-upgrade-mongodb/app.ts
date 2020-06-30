import { Application } from "https://deno.land/x/oak/mod.ts";

import {
  green,
  cyan,
  bold,
  yellow,
} from "https://deno.land/std@0.59.0/fmt/colors.ts";

import dogsRouter from "./controllers/dogs.ts";
import friendsRouter from "./controllers/friends.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  /* Do some checking of the request */
  await next();
  /* Do some finalising of the response */
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
});

// Response Time
app.use(async (ctx, next) => {
  const start = Date.now();
  /* Do some checking of the request */
  await next();
  /* Do some finalising of the response */
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// friends
app.use(friendsRouter.routes());
app.use(friendsRouter.allowedMethods());

// dogs
app.use(dogsRouter.routes());
app.use(dogsRouter.allowedMethods());

// Listen
app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(
    `${yellow("Listening on:")} ${green(url)}`,
  );
});

await app.listen(`${HOST}:${PORT}`);
console.log(bold("Finished."));
